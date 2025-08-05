from fastapi import APIRouter, status, Query, Depends, HTTPException, UploadFile, File
from app.schemas.products import ProductsOut, ProductOut, ProductCreate, ProductUpdate, ProductsAIAnalysisOut, TextSearchRequest
from app.database import get_db
from app.oauth2 import get_current_user, get_admin_user
from app.models import User, Product, Category, Comment
from sqlalchemy import asc, text
from sqlalchemy.orm import Session
from app.gemini import generate_product_description, refine_query, generate_comment_summary
from app.huggingface import embed_product, embed_text
from app.speech_to_text import transcribe_audio
from collections import Counter


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.get(
    path="/",
    status_code=status.HTTP_200_OK,
    response_model=ProductsOut
)
def get_all_products(
    search: str = "",
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    products = db.query(Product).\
        order_by(asc(Product.id)).\
        filter(Product.title.ilike(f"%{search}%")).\
        limit(limit).\
        offset((page - 1) * limit).\
        all()
    
    return {"data": products}
        

@router.get(
    path="/{product_id}",
    status_code=status.HTTP_206_PARTIAL_CONTENT,
    response_model=ProductOut
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product = db.query(Product).\
        filter(Product.id == product_id).\
        first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id: {product_id} does not exist!"
        )
    return product


@router.post(
    path="/",
    status_code=status.HTTP_201_CREATED,
    response_model=ProductOut
)
def create_product(
    new_product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    category_exists = db.query(Category).\
        filter(Category.id == new_product.category_id).\
        first()

    if not category_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id: {new_product.category_id} does not exist!"
        )

    new_product_dict = new_product.model_dump()
    product = Product(**new_product_dict)

    product.category = db.query(Category).\
        filter(Category.id == product.category_id).\
        first()

    if not product.description:
        product.description = generate_product_description(product)

    product.embedding = embed_product(
        title=product.title,
        description=product.description,
        brand=product.brand
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


@router.put(
    path="/{product_id}",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=ProductOut
)
def update_product(
    product_id: int,
    updated_product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    product = db.query(Product).\
        filter(Product.id == product_id).\
        first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id: {product_id} does not exist!"
        )

    category_exists = db.query(Category).\
        filter(Category.id == updated_product.category_id).\
        first()

    if not category_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id: {updated_product.category_id} does not exist!"
        )

    for key, value in updated_product.model_dump().items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return product


@router.delete(
    path="/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    product = db.query(Product).\
        filter(Product.id == product_id).\
        first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id: {product_id} does not exist!"
        )

    db.delete(product)
    db.commit()

    return


@router.post(
    path="/text_search",
    status_code=status.HTTP_200_OK,
    response_model=ProductsOut
)
def text_search_products(
    body: TextSearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    refined_query = refine_query(body.search)

    print(f"REFINED QUERY: {refined_query}")

    query_embedding = embed_text(refined_query)

    embedding_str = "[" + ",".join(map(str, query_embedding)) + "]"

    sql = text(f"""
        SELECT 
            products.*,
            categories.id AS category_id,
            categories.name AS category_name,
            embedding <=> :embedding AS distance
        FROM products
        JOIN categories ON products.category_id = categories.id
        ORDER BY distance
        LIMIT :limit
    """)
    result = db.execute(sql, {"embedding": embedding_str, "limit": body.limit}).mappings().all()

    result_data = []

    for row in result:
        row = dict(row)
        product = {
            "id": row["id"],
            "title": row["title"],
            "description": row["description"],
            "price": row["price"],
            "discount_percentage": row["discount_percentage"],
            "rating": row["rating"],
            "stock": row["stock"],
            "brand": row["brand"],
            "thumbnail": row["thumbnail"],
            "images": row["images"],
            "is_published": row["is_published"],
            "created_at": row["created_at"],
            "category": {
                "id": row["category_id"],
                "name": row["category_name"]
            }
        }
        result_data.append(product)

    return {"data": result_data}
    

@router.post(
    path="/voice_search",
    status_code=status.HTTP_200_OK,
    response_model=ProductsOut
)
async def voice_search_products(
    file: UploadFile = File(...),
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transcript = await transcribe_audio(file)

    body = TextSearchRequest(
        search=transcript,
        limit=limit
    )

    result = text_search_products(
        body=body,
        db=db,
        current_user=current_user
    )
    
    return result


@router.get(
    path="/{product_id}/ai_analysis",
    status_code=status.HTTP_200_OK,
    response_model=ProductsAIAnalysisOut
)
def get_product_ai_analysis(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product = db.query(Product).\
        filter(Product.id == product_id).\
        first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id: {product_id} does not exist!"
        )

    comments = db.query(Comment).\
        filter(Comment.product_id == product_id).\
        all()

    len_comments = len(comments)
    if len_comments == 0:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail=F"Product with id: {product_id} does not have any comments!"
        )

    sentiment_score_avg = sum([+1 if comment.sentiment_label == "positive" else -1 if comment.sentiment_label == "negative" else 0 for comment in comments]) / len_comments
    sentiment_label_counts = Counter([comment.sentiment_label for comment in comments])
    comments_summary = generate_comment_summary([comment.content for comment in comments])

    result = {
        "product": product, 
        "sentiment_score_avg": sentiment_score_avg, 
        "sentiment_label_counts": sentiment_label_counts, 
        "comments_summary": comments_summary
    }

    return result

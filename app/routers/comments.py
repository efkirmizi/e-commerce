from fastapi import APIRouter, Query, Depends, status, HTTPException
from ..models import User, Product, Comment
from ..database import get_db
from ..oauth2 import get_current_user
from ..huggingface import analyze_comment_sentiment
from ..schemas.comments import CommentCreate, CommentOut, CommentsOut, CommentUpdate
from sqlalchemy import asc
from sqlalchemy.orm import Session
from datetime import datetime, timezone


router = APIRouter(
    tags=["Product Comments"]
)


@router.get(
    path="/products/{product_id}/comments",
    status_code=status.HTTP_200_OK,
    response_model=CommentsOut
)
def get_product_comments(
    product_id: int,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
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
        order_by(asc(Comment.id)).\
        filter(Comment.product_id == product_id).\
        limit(limit).\
        offset((page - 1) * limit).\
        all()
    
    return {"data": comments}


@router.get(
    path="/products/{product_id}/comments/{comment_id}",
    status_code=status.HTTP_200_OK,
    response_model=CommentOut
)
def get_product_comment(
    product_id: int,
    comment_id: int,
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

    comment = db.query(Comment).\
        filter(
            Comment.id == comment_id,
            Comment.product_id == product_id
        ).\
        first()
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comment with id: {comment_id} does not exist!"
        )

    return comment


@router.post(
    path="/products/{product_id}/comments",
    status_code=status.HTTP_201_CREATED,
    response_model=CommentOut
)
def create_product_comment(
    product_id: int,
    new_comment: CommentCreate,
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

    sentiment_analysis = analyze_comment_sentiment(new_comment.content)
    sentiment_score = sentiment_analysis[0]["score"]
    sentiment_label = sentiment_analysis[0]["label"]
    
    comment = Comment(
        product_id=product_id,
        user_id=current_user.id,
        created_at=datetime.now(timezone.utc),
        content=new_comment.content.strip(),
        rating=new_comment.rating,
        sentiment_score=sentiment_score,
        sentiment_label=sentiment_label
    )
    
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment


@router.put(
    path="/products/{product_id}/comments/{comment_id}",
    status_code=status.HTTP_200_OK,
    response_model=CommentOut
)
def update_product_comment(
    product_id: int,
    comment_id: int,
    updated_comment: CommentUpdate,
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

    comment = db.query(Comment).\
        filter(
            Comment.id == comment_id,
            Comment.product_id == product_id
        ).\
        first()
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comment with id: {comment_id} does not exist!"
        )
    
    if (comment.user_id != current_user.id) and (current_user.role != "admin"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to edit this comment!"
        )
    
    if comment.content != updated_comment.content:
        comment.content = updated_comment.content
        sentiment_analysis = analyze_comment_sentiment(comment.content)
        comment.sentiment_label = sentiment_analysis["label"]
        comment.sentiment_score = sentiment_analysis["score"]
    
    comment.rating = updated_comment.rating
    comment.created_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(comment)

    return comment


@router.delete(
    path="/products/{product_id}/comments/{comment_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_product_comment(
    product_id: int,
    comment_id: int,
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

    comment = db.query(Comment).\
        filter(
            Comment.id == comment_id,
            Comment.product_id == product_id
        ).\
        first()
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comment with id: {comment_id} does not exist!"
        )
    
    if (comment.user_id != current_user.id) and (current_user.role != "admin"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to delete this comment!"
        )
    
    db.delete(comment)
    db.commit()

    return

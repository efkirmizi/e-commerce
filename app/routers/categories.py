from fastapi import APIRouter, status, Depends, Query, HTTPException
from ..schemas.categories import CategoriesOut, CategoryOut, CategoryCreate, CategoryUpdate
from ..database import get_db
from ..oauth2 import get_current_user, get_admin_user
from ..models import User, Category
from sqlalchemy import asc
from sqlalchemy.orm import Session


router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)


@router.get(
    path="/",
    status_code=status.HTTP_200_OK,
    response_model=CategoriesOut
)
def get_all_categories(
    search: str = "",
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    categories = db.query(Category).\
        order_by(asc(Category.id)).\
        filter(Category.name.ilike(f"%{search}")).\
        limit(limit).\
        offset((page - 1) * limit).\
        all()

    return {"data": categories}


@router.get(
    path="/{category_id}",
    status_code=status.HTTP_206_PARTIAL_CONTENT,
    response_model=CategoryOut
)
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    category = db.query(Category).\
        filter(Category.id == category_id).\
        first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id: {category_id} does not exist!"
        )
    return category


@router.post(
    path="/",
    status_code=status.HTTP_201_CREATED,
    response_model=CategoryOut
)
def create_category(
    new_category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    new_category_dict = new_category.model_dump()

    existing_category = db.query(Category).\
        filter(Category.name == new_category_dict["name"]).\
        first()

    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"Category with name: {new_category["name"]} already exists!"
        )
    category = Category(**new_category_dict)
    
    db.add(category)
    db.commit()
    db.refresh(category)

    return category


@router.put(
    path="/{category_id}",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=CategoryOut
)
def update_category(
    category_id: int,
    updated_category: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    category = db.query(Category).\
        filter(Category.id == category_id).\
        first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id: {category_id} does not exist!"
        )

    for key, value in updated_category.model_dump().items():
        setattr(category, key, value)

    db.commit()
    db.refresh(category)

    return category


@router.delete(
    path="/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    category = db.query(Category).\
        filter(Category.id == category_id).\
        first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id: {category_id} does not exist!"
        )

    db.delete(category)
    db.commit()

    return

from fastapi import APIRouter, Query, status, Depends, HTTPException
from ..schemas.users import UsersOut, UserOut, UserCreate, UserUpdate
from ..database import get_db
from ..oauth2 import get_current_user, get_admin_user
from ..models import User
from ..utils import hash
from sqlalchemy import asc
from sqlalchemy.orm import Session


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get(
    path="/",
    status_code=status.HTTP_200_OK,
    response_model=UsersOut
)
def get_all_users(
    search: str = "",
    role: str = "user",
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    users = db.query(User).\
        order_by(asc(User.id)).\
        filter(
            User.username.ilike(f"%{search}"),
            User.role == role
        ).\
        limit(limit).\
        offset((page - 1) * limit).\
        all()

    return {"data": users}


@router.get(
    path="/{user_id}",
    status_code=status.HTTP_206_PARTIAL_CONTENT,
    response_model=UserOut
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).\
        filter(User.id == user_id).\
        first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {user_id} does not exist!"
        )

    return user


@router.post(
    path="/",
    status_code=status.HTTP_201_CREATED,
    response_model=UserOut
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    username_exists = db.query(User).\
        filter(User.username == user.username).\
        first()

    if username_exists:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"User with username: {user.username} already exists!"
        )

    email_exists = db.query(User).\
        filter(User.email == user.email).\
        first()

    if email_exists:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"User with email: {user.email} already exists!"
        )
    
    user_dict = user.model_dump()
    new_user = User(**user_dict)

    new_user.password = hash(new_user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.put(
    path="/{user_id}",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=UserOut
)
def update_user(
    user_id: int,
    updated_user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).\
        filter(
            User.id == current_user.id,
            User.id == user_id
        ).\
        first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {user_id} does not exist!"
        )

    username_exists = db.query(User).\
        filter(User.username == updated_user.username).\
        first()

    if username_exists and username_exists.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"User with username: {updated_user.username} already exists!"
        )

    email_exists = db.query(User).\
        filter(User.email == updated_user.email).\
        first()

    if email_exists and email_exists.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"User with email: {updated_user.email} already exists!"
        )

    for key, value in updated_user.model_dump().items():
        setattr(user, key, value)

    user.password = hash(user.password)
    db.commit()
    db.refresh(user)
    
    return user


@router.delete(
    path="/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).\
        filter(
            User.id == user_id,
            User.id == current_user.id       
        ).\
        first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {user_id} does not exist!"
        )

    db.delete(user)
    db.commit()

    return

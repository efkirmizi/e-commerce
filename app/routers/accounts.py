from fastapi import APIRouter, Depends, status, HTTPException
from app.database import get_db
from app.oauth2 import get_current_user
from app.schemas.accounts import AccountUpdate, AccountOut
from app.models import User
from app.utils import hash
from sqlalchemy.orm import Session


router = APIRouter(
    prefix="/me",
    tags=["Account"]
)


@router.get(
    path="/",
    status_code=status.HTTP_200_OK,
    response_model=AccountOut
)
def get_my_info(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.put(
    path="/",
    status_code=status.HTTP_200_OK,
    response_model=AccountOut
)
def edit_my_info(
    updated_user: AccountUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if updated_user.username != current_user.username:
        existing_username = db.query(User).\
            filter(User.username == updated_user.username).\
            first()
        
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"User with username: {updated_user.username} already exists!"
            )

    current_user.username = updated_user.username
    current_user.fullname = updated_user.fullname
    current_user.password = hash(updated_user.password)

    db.commit()
    db.refresh(current_user)

    return current_user


@router.delete(
    path="/", 
    status_code=status.HTTP_204_NO_CONTENT
)
def remove_my_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.delete(current_user)
    db.commit()

    return

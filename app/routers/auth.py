from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from ..database import get_db
from .. import models, utils, oauth2
from ..schemas.auth import Token
from sqlalchemy.orm import Session


router = APIRouter(
    prefix="/login",
    tags=["Authentication"]
)


@router.post(
    path="/",
    status_code=status.HTTP_200_OK,
    response_model=Token
)
def login(
    user_credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).\
        filter(models.User.email == user_credentials.username).\
        first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail=f"Invalid Credentials!"
        )
    
    if not utils.verify_password(user.password, user_credentials.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail=f"Invalid Credentials!"
        )

    access_token = oauth2.create_access_token(data={
        "user_id": user.id
    })

    return {"access_token": access_token, "token_type": "bearer"}

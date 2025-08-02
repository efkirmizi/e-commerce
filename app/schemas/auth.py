from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional
from .carts import CartBase


class UserBase(BaseModel):
    id: int
    username: str
    email: EmailStr
    password: str
    fullname: str
    role: str
    is_active: bool
    created_at: datetime
    carts: List[CartBase]

    class Config:
        from_attributes = True


class SignUp(BaseModel):
    username: str
    email: EmailStr
    fullname: str
    password: str

    class Config:
        from_attributes = True


class UserOut(UserBase):
    pass

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = 'Bearer'


class TokenData(BaseModel):
    id: Optional[int] = None

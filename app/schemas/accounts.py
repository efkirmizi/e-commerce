from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List
from .carts import CartBase


class AccountBase(BaseModel):
    id: int
    username: str
    email: EmailStr
    fullname: str
    role: str
    is_active: bool
    created_at: datetime
    carts: List[CartBase]

    class Config:
        from_attributes = True


class AccountUpdate(BaseModel):
    username: str
    fullname: str
    password: str


class AccountOut(AccountBase):
    pass

    class Config:
        from_attributes = True

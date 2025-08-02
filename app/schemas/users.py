from pydantic import BaseModel, EmailStr
from typing import List
from datetime import datetime
from app.schemas.carts import CartBase


class BaseConfig:
    from_attributes = True


class UserBase(BaseModel):
    id: int
    username: str
    fullname: str
    is_active: bool
    created_at: datetime
    carts: List[CartBase]

    class Config(BaseConfig):
        pass


class UserCreate(BaseModel):
    fullname: str
    username: str
    email: EmailStr
    password: str

    class Config(BaseConfig):
        pass


class UserUpdate(UserCreate):
    pass


class UserOut(UserBase):
    pass

    class Config(BaseConfig):
        pass


class UsersOut(BaseModel):
    data: List[UserBase]

    class Config(BaseConfig):
        pass


class UserOutDelete(UserBase):
    pass

    class Config(BaseConfig):
        pass
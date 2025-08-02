from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from .products import ProductBase, CategoryBase


class BaseConfig:
    from_attributes = True


class ProductBaseCart(ProductBase):
    category: CategoryBase = Field(exclude=True)

    class Config(BaseConfig):
        pass


class CartItemBase(BaseModel):
    id: int
    product_id: int
    quantity: int
    subtotal: float
    product: ProductBaseCart


class CartBase(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    total_amount: float
    cart_items: List[CartItemBase]

    class Config(BaseConfig):
        pass


class CartOutBase(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    total_amount: float
    cart_items: List[CartItemBase]

    class Config(BaseConfig):
        pass


class CartOut(CartBase):
    pass

    class Config(BaseConfig):
        pass


class CartsOutList(BaseModel):
    data: List[CartBase]


class CartsUserOutList(BaseModel):
    data: List[CartBase]

    class Config(BaseConfig):
        pass


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int


class CartCreate(BaseModel):
    cart_items: List[CartItemCreate]

    class Config(BaseConfig):
        pass


class CartUpdate(CartCreate):
    pass

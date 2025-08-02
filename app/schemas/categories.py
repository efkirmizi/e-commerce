from typing import List
from pydantic import BaseModel


class CategoryBase(BaseModel):
    id: int
    name: str


class CategoryCreate(BaseModel):
    name: str


class CategoryUpdate(BaseModel):
    name: str


class CategoryOut(CategoryBase):
    pass

class CategoriesOut(BaseModel):
    data: List[CategoryBase]

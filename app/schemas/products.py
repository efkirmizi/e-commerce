from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import List, Optional
from app.schemas.categories import CategoryBase


class BaseConfig:
    from_attributes = True


class ProductBase(BaseModel):
    id: int
    title: str
    description: Optional[str] = ""
    price: float
    discount_percentage: float
    rating: float
    stock: int
    brand: str
    thumbnail: str
    images: List[str]
    is_published: bool
    created_at: datetime
    category: "CategoryBase"  # assuming forward reference

    @field_validator("discount_percentage", mode='before')
    def validate_discount_percentage(cls, v):
        if v < 0 or v > 100:
            raise ValueError("discount_percentage must be between 0 and 100")
        return v

    class Config:
        from_attributes = True
        

class ProductCreate(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    discount_percentage: float
    rating: float
    stock: int
    brand: str
    thumbnail: str
    images: List[str]
    is_published: bool = True
    category_id: int

    @field_validator("discount_percentage", mode='before')
    def validate_discount_percentage(cls, v):
        if v < 0 or v > 100:
            raise ValueError("discount_percentage must be between 0 and 100")
        return v

    class Config(BaseConfig):
        pass


class ProductUpdate(ProductCreate):
    pass


# Get Products
class ProductOut(ProductBase):
    pass

    class Config(BaseConfig):
        pass


class ProductsOut(BaseModel):
    data: List[ProductBase]

    class Config(BaseConfig):
        pass


class ProductsAIAnalysisOut(BaseModel):
    product: ProductBase
    sentiment_score_avg: float
    sentiment_label_counts: dict
    comments_summary: str

    class Config(BaseConfig):
        pass


class TextSearchRequest(BaseModel):
    search: str
    limit: int = 10
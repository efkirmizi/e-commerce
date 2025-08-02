from pydantic import BaseModel
from datetime import datetime
from typing import List


class CommentBase(BaseModel):
    id: int
    product_id: int
    content: str
    rating: float
    created_at: datetime
    sentiment_score: float
    sentiment_label: str

    class Config:
        from_attributes = True


class CommentOut(CommentBase):
    pass


class CommentsOut(BaseModel):
    data: List[CommentBase]


class CommentCreate(BaseModel):
    content: str
    rating: float

    class Config:
        from_attributes = True


class CommentUpdate(CommentCreate):
    pass

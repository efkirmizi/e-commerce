// src/types/comment.ts

export interface CommentBase {
  product_id: number;
  content: string;
  rating: number;
  created_at: string;       // datetime as ISO string
  sentiment_score: number;
  sentiment_label: string;
}

export interface CommentOut extends CommentBase {}

export interface CommentsOut {
  data: CommentBase[];
}

export interface CommentCreate {
  content: string;
  rating: number;
}

export interface CommentUpdate extends CommentCreate {}

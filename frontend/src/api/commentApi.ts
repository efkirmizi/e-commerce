import api from '../axios';

export interface CommentBase {
  id: number;
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

const API_BASE = "/products"; // relative path for API base

export async function fetchCommentsByProduct(
  productId: number,
  page = 1,
  limit = 10
): Promise<CommentsOut> {
  const res = await api.get<CommentsOut>(
    `${API_BASE}/${productId}/comments`,
    {
      params: { page, limit },
    }
  );
  return res.data;
}

export async function fetchComment(
  productId: number,
  commentId: number
): Promise<CommentOut> {
  const res = await api.get<CommentOut>(
    `${API_BASE}/${productId}/comments/${commentId}`
  );
  return res.data;
}

export async function createComment(
  productId: number,
  commentData: CommentCreate
): Promise<CommentOut> {
  const res = await api.post<CommentOut>(
    `${API_BASE}/${productId}/comments`,
    commentData
  );
  return res.data;
}

export async function updateComment(
  productId: number,
  commentId: number,
  commentData: CommentUpdate
): Promise<CommentOut> {
  const res = await api.put<CommentOut>(
    `${API_BASE}/${productId}/comments/${commentId}`,
    commentData
  );
  return res.data;
}

export async function deleteComment(
  productId: number,
  commentId: number
): Promise<void> {
  await api.delete(`${API_BASE}/${productId}/comments/${commentId}`);
}

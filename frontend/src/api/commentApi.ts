// src/api/commentApi.ts

import axios from 'axios';

interface CommentBase {
  id: number;
  product_id: number;
  content: string;
  rating: number;
  created_at: string;       // datetime as ISO string
  sentiment_score: number;
  sentiment_label: string;
}

interface CommentOut extends CommentBase {}

interface CommentsOut {
  data: CommentBase[];
}

interface CommentCreate {
  content: string;
  rating: number;
}

interface CommentUpdate extends CommentCreate {}

const API_BASE = 'http://localhost:8000'; // adjust if needed

export async function fetchCommentsByProduct(
  productId: number,
  page = 1,
  limit = 10
): Promise<CommentsOut> {
  const res = await axios.get<CommentsOut>(
    `${API_BASE}/products/${productId}/comments`,
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
  const res = await axios.get<CommentOut>(
    `${API_BASE}/products/${productId}/comments/${commentId}`
  );
  return res.data;
}

export async function createComment(
  productId: number,
  commentData: CommentCreate
): Promise<CommentOut> {
  const res = await axios.post<CommentOut>(
    `${API_BASE}/products/${productId}/comments`,
    commentData
  );
  return res.data;
}

export async function updateComment(
  productId: number,
  commentId: number,
  commentData: CommentUpdate
): Promise<CommentOut> {
  const res = await axios.put<CommentOut>(
    `${API_BASE}/products/${productId}/comments/${commentId}`,
    commentData
  );
  return res.data;
}

export async function deleteComment(
  productId: number,
  commentId: number
): Promise<void> {
  await axios.delete(`${API_BASE}/products/${productId}/comments/${commentId}`);
}

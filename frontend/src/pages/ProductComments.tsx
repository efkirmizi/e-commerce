import React, { useState } from 'react';

interface CommentBase {
  id: number;
  product_id: number;
  content: string;
  rating: number;
  created_at: string;       // datetime as ISO string
  sentiment_score: number;
  sentiment_label: string;
}

interface CommentOut extends CommentBase {
  id: number; // you need id for keys, editing, deleting
}

import {
  fetchCommentsByProduct,
  createComment,
  updateComment,
  deleteComment,
} from '../api/commentApi';

interface ProductCommentsProps {
  productId: number;
}

export default function ProductComments({ productId }: ProductCommentsProps) {
  const [comments, setComments] = useState<CommentOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NOTE: rating is a string here because inputs return string
  const [newComment, setNewComment] = useState<{content: string; rating: string}>({
    content: '',
    rating: '0',
  });

  // Editing comment state: rating is string here too
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<{content: string; rating: string}>({
    content: '',
    rating: '0',
  });

  // Load comments
  async function loadComments() {
    setLoading(true);
    try {
      const res = await fetchCommentsByProduct(productId);
      setComments(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadComments();
  }, [productId]);

  // Handle input change for new comment form
  function handleNewCommentChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setNewComment({ ...newComment, [e.target.name]: e.target.value });
  }

  // Handle new comment submit
  async function handleNewCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createComment(productId, {
        content: newComment.content,
        rating: Number(newComment.rating), // convert to number here
      });
      setNewComment({ content: '', rating: '0' });
      await loadComments();
    } catch {
      setError('Failed to add comment');
    }
  }

  // Start editing a comment
  function startEdit(comment: CommentOut) {
    setEditingCommentId(comment.id);
    setEditingComment({ content: comment.content, rating: comment.rating.toString() }); // convert to string here
  }

  // Handle editing comment input change
  function handleEditChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setEditingComment({ ...editingComment, [e.target.name]: e.target.value });
  }

  // Submit edited comment
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingCommentId === null) return;
    try {
      await updateComment(productId, editingCommentId, {
        content: editingComment.content,
        rating: Number(editingComment.rating), // convert to number here
      });
      setEditingCommentId(null);
      setEditingComment({ content: '', rating: '0' });
      await loadComments();
    } catch {
      setError('Failed to update comment');
    }
  }

  // Cancel editing
  function cancelEdit() {
    setEditingCommentId(null);
    setEditingComment({ content: '', rating: '0' });
  }

  // Delete comment
  async function handleDelete(commentId: number) {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment(productId, commentId);
      await loadComments();
    } catch {
      setError('Failed to delete comment');
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h3 className="text-xl font-bold mb-4">Comments</h3>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        comments.map((comment) =>
          editingCommentId === comment.id ? (
            <form key={comment.id} onSubmit={handleEditSubmit} className="mb-4 p-2 border rounded">
              <textarea
                name="content"
                value={editingComment.content}
                onChange={handleEditChange}
                required
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="number"
                name="rating"
                value={editingComment.rating}
                onChange={handleEditChange}
                min={0}
                max={5}
                step={0.1}
                required
                className="w-20 p-2 border rounded mb-2"
              />
              <div>
                <button
                  type="submit"
                  className="mr-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div
              key={comment.id}
              className="mb-4 p-2 border rounded bg-gray-50"
            >
              <p>{comment.content}</p>
              <p>
                Rating: <strong>{comment.rating.toFixed(1)}</strong>
              </p>
              <p>
                Sentiment: <em>{comment.sentiment_label}</em> (
                {comment.sentiment_score.toFixed(2)})
              </p>
              <p className="text-xs text-gray-500">
                Posted at: {new Date(comment.created_at).toLocaleString()}
              </p>
              <button
                onClick={() => startEdit(comment)}
                className="mr-2 bg-yellow-400 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(comment.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          )
        )
      )}

      {/* Add new comment form */}
      <form onSubmit={handleNewCommentSubmit} className="mt-6 p-4 border rounded bg-white">
        <h4 className="font-semibold mb-2">Add a Comment</h4>
        <textarea
          name="content"
          placeholder="Write your comment"
          value={newComment.content}
          onChange={handleNewCommentChange}
          required
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (0-5)"
          value={newComment.rating}
          onChange={handleNewCommentChange}
          min={0}
          max={5}
          step={0.1}
          required
          className="w-24 p-2 border rounded mb-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

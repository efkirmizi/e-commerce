import { useEffect, useState, useRef } from 'react';
import { fetchUsers, deleteUser } from '../api/userApi';

interface CartItemBase {
  id: number;
  product_id: number;
  quantity: number;
  subtotal: number;
}

interface CartBase {
  id: number;
  user_id: number;
  created_at: string; // datetime ISO string
  total_amount: number;
  cart_items: CartItemBase[];
}

interface UserBase {
  id: number;
  username: string;
  fullname: string;
  is_active: boolean;
  created_at: string; // ISO datetime string
  carts: CartBase[];
}

interface UserOut extends UserBase {}

export default function UserListAdmin() {
  const [users, setUsers] = useState<UserOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const debounceTimeout = useRef<number | null>(null);

  async function loadUsers(query: string) {
    setLoading(true);
    try {
      const data = await fetchUsers(query, 'user');
      setUsers(data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      loadUsers(search);
    }, 500); // wait 500ms after user stops typing
    // Cleanup on unmount or new effect call
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [search]);

  async function handleDelete(userId: number) {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
      await loadUsers(search);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete user');
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <input
        type="text"
        placeholder="Search users by username"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 rounded w-full"
      />
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id} className="mb-3 border p-3 rounded bg-gray-50">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Fullname:</strong> {user.fullname}</p>
              <p><strong>Active:</strong> {user.is_active ? 'Yes' : 'No'}</p>
              <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
              <button
                onClick={() => handleDelete(user.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete User
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

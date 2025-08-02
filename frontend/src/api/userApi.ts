import axios from 'axios';

// src/types/user.ts
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

interface UserCreate {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

interface UserUpdate extends UserCreate {}

interface UserOut extends UserBase {}

interface UsersOut {
  data: UserBase[];
}

const api = axios.create({
  baseURL: 'http://localhost:8000/users', // adjust your backend URL
});

// Get all users with optional search and role filter (admin only)
export async function fetchUsers(
  search = '',
  role = 'user',
  page = 1,
  limit = 10
): Promise<UsersOut> {
  const res = await api.get<UsersOut>('/', {
    params: { search, role, page, limit },
  });
  return res.data;
}

// Get user by ID
export async function fetchUser(userId: number): Promise<UserOut> {
  const res = await api.get<UserOut>(`/${userId}`);
  return res.data;
}

// Create new user
export async function createUser(data: UserCreate): Promise<UserOut> {
  const res = await api.post<UserOut>('/', data);
  return res.data;
}

// Update user (user can only update own data)
export async function updateUser(userId: number, data: UserUpdate): Promise<UserOut> {
  const res = await api.put<UserOut>(`/${userId}`, data);
  return res.data;
}

// Delete user (user can only delete own account)
export async function deleteUser(userId: number): Promise<void> {
  await api.delete(`/${userId}`);
}

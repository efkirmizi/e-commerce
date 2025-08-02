// src/types/user.ts
export interface CartItemBase {
  id: number;
  product_id: number;
  quantity: number;
  subtotal: number;
}

export interface CartBase {
  id: number;
  user_id: number;
  created_at: string; // datetime ISO string
  total_amount: number;
  cart_items: CartItemBase[];
}

export interface UserBase {
  id: number;
  username: string;
  fullname: string;
  is_active: boolean;
  created_at: string; // ISO datetime string
  carts: CartBase[];
}

export interface UserCreate {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

export interface UserUpdate extends UserCreate {}

export interface UserOut extends UserBase {}

export interface UsersOut {
  data: UserBase[];
}

export interface UserOutDelete extends UserBase {}

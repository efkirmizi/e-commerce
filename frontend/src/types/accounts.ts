// src/types/account.ts
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

export interface AccountBase {
  id: number;
  username: string;
  email: string;        // EmailStr maps to string
  fullname: string;
  role: string;
  is_active: boolean;
  created_at: string;   // datetime serialized as ISO string
  carts: CartBase[];
}

export interface AccountUpdate {
  username: string;
  fullname: string;
  password: string;
}

export interface AccountOut extends AccountBase {}

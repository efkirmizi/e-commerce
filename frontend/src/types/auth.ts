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
  email: string;        // EmailStr -> string
  password: string;
  fullname: string;
  role: string;
  is_active: boolean;
  created_at: string;   // datetime as ISO string
  carts: CartBase[];
}

export interface SignUp {
  username: string;
  email: string;
  fullname: string;
  password: string;
}

export interface UserOut extends UserBase {}

export interface Token {
  access_token: string;
  token_type: string;  // defaults to 'Bearer'
}

export interface TokenData {
  id?: number | null;
}

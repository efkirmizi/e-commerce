// src/types/cart.ts
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

export interface CartOutBase extends CartBase {}

export interface CartOut extends CartBase {}

export interface CartsOutList {
  data: CartBase[];
}

export interface CartsUserOutList {
  data: CartBase[];
}

export interface CartItemCreate {
  product_id: number;
  quantity: number;
}

export interface CartCreate {
  cart_items: CartItemCreate[];
}

export interface CartUpdate extends CartCreate {}

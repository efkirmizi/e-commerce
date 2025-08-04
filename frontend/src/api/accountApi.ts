// src/api/accountApi.ts
import api from "../axios";

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

export const getMyInfo = async (): Promise<AccountOut> => {
  const res = await api.get<AccountOut>('/me');
  return res.data;
};

export const updateMyInfo = async (payload: AccountUpdate): Promise<AccountOut> => {
  const res = await api.put<AccountOut>('/me', payload);
  return res.data;
};

export const deleteMyAccount = async (): Promise<void> => {
  await api.delete('/me');
};

// src/api/accountApi.ts
import axios from "axios";

// src/types/account.ts
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

interface AccountBase {
  id: number;
  username: string;
  email: string;        // EmailStr maps to string
  fullname: string;
  role: string;
  is_active: boolean;
  created_at: string;   // datetime serialized as ISO string
  carts: CartBase[];
}

interface AccountUpdate {
  username: string;
  fullname: string;
  password: string;
}

interface AccountOut extends AccountBase {}

export const getMyInfo = async (): Promise<AccountOut> => {
  const res = await axios.get<AccountOut>('/me');
  return res.data;
};

export const updateMyInfo = async (payload: AccountUpdate): Promise<AccountOut> => {
  const res = await axios.put<AccountOut>('/me', payload);
  return res.data;
};

export const deleteMyAccount = async (): Promise<void> => {
  await axios.delete('/me');
};

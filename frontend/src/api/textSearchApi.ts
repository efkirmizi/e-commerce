// src/api/textSearchApi.ts
import axios from 'axios';

// src/types/product.ts
interface CategoryBase {
  id: number;
  name: string;
}

interface ProductBase {
  id: number;
  title: string;
  description?: string;
  price: number;
  discount_percentage: number; // 0-100 validation done backend-side
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
  is_published: boolean;
  created_at: string;  // ISO datetime string
  category: CategoryBase;
}

interface ProductsOut {
  data: ProductBase[];
}

export const textSearchProducts = async (search: string, limit = 10): Promise<ProductsOut> => {
  const response = await axios.post<ProductsOut>("/text_search", { search, limit });
  return response.data;
};

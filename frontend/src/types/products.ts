// src/types/product.ts
export interface CategoryBase {
  id: number;
  name: string;
}

export interface ProductBase {
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

export interface ProductCreate {
  title: string;
  description?: string | null;
  price: number;
  discount_percentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
  is_published?: boolean;  // default true
  category_id: number;
}

export interface ProductUpdate extends ProductCreate {}

export interface ProductOut extends ProductBase {}

export interface ProductsOut {
  data: ProductBase[];
}

export interface ProductsAIAnalysisOut {
  product: ProductBase;
  sentiment_score_avg: number;
  sentiment_label_counts: Record<string, number>;
  comments_summary: string;
}

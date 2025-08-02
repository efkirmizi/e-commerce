import axios from 'axios';

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

interface ProductCreate {
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

interface ProductUpdate extends ProductCreate {}

interface ProductOut extends ProductBase {}

interface ProductsOut {
  data: ProductBase[];
}

interface ProductsAIAnalysisOut {
  product: ProductBase;
  sentiment_score_avg: number;
  sentiment_label_counts: Record<string, number>;
  comments_summary: string;
}

const api = axios.create({
  baseURL: 'http://localhost:8000/products', // adjust as needed
});

// Get paginated list of products with optional search
export async function fetchProducts(
  search = '',
  page = 1,
  limit = 10
): Promise<ProductsOut> {
  const res = await api.get<ProductsOut>('/', {
    params: { search, page, limit },
  });
  return res.data;
}

// Get single product by ID
export async function fetchProduct(productId: number): Promise<ProductOut> {
  const res = await api.get<ProductOut>(`/${productId}`);
  return res.data;
}

// Create a new product (admin only)
export async function createProduct(data: ProductCreate): Promise<ProductOut> {
  const res = await api.post<ProductOut>('/', data);
  return res.data;
}

// Update existing product (admin only)
export async function updateProduct(
  productId: number,
  data: ProductUpdate
): Promise<ProductOut> {
  const res = await api.put<ProductOut>(`/${productId}`, data);
  return res.data;
}

// Delete product (admin only)
export async function deleteProduct(productId: number): Promise<void> {
  await api.delete(`/${productId}`);
}

// Text search products with embedding search
export async function textSearchProducts(
  search: string,
  limit = 10
): Promise<ProductsOut> {
  const res = await api.post<ProductsOut>('/text_search', null, {
    params: { search, limit },
  });
  return res.data;
}

// Voice search products - Upload audio file
export async function voiceSearchProducts(
  file: File,
  limit = 10
): Promise<ProductsOut> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post<ProductsOut>('/voice_search', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: { limit },
  });
  return res.data;
}

// Get AI analysis of a product's comments
export async function fetchProductAIAnalysis(
  productId: number
): Promise<ProductsAIAnalysisOut> {
  const res = await api.get<ProductsAIAnalysisOut>(`/${productId}/ai_analysis`);
  return res.data;
}

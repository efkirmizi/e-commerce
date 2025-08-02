import { useEffect, useState } from 'react';
import { fetchProducts, textSearchProducts } from '../api/productApi';

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

export default function ProductList() {
  const [products, setProducts] = useState<ProductOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  async function loadProducts() {
    setLoading(true);
    try {
      const data = search
        ? await textSearchProducts(search)
        : await fetchProducts();
      setProducts(data.data);
      setError(null);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [search]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mb-4"
      />

      {error && <p className="text-red-600">{error}</p>}

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id} className="mb-3 border p-3 rounded">
              <h3 className="font-bold">{product.title}</h3>
              <p>{product.description}</p>
              <p>
                Price: ${product.price} | Rating: {product.rating} | Stock: {product.stock}
              </p>
              <p>Category: {product.category.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// src/pages/ProductListPage.tsx
import { useState, useEffect } from "react";
import api from "../axios";

interface CategoryBase {
  id: number;
  name: string;
}

interface ProductBase {
  id: number;
  title: string;
  description?: string;
  price: number;
  discount_percentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
  is_published: boolean;
  created_at: string;
  category: CategoryBase;
}

interface ProductsOut {
  data: ProductBase[];
  // Add pagination metadata here if backend supports it
  total_items?: number;
  total_pages?: number;
  current_page?: number;
  page_size?: number;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<ProductBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const params = {
          search: debouncedSearch,
          page,
          limit: 10,
        };
        const response = await api.get<ProductsOut>("/products/", { params });
        setProducts(response.data.data);

        // If backend returns total_pages, update it
        if (response.data.total_pages !== undefined) {
          setTotalPages(response.data.total_pages);
        } else {
          setTotalPages(null);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.detail ||
            "Failed to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [debouncedSearch, page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (totalPages === null || page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Product List</h1>

      <input
        type="text"
        placeholder="Search products by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded p-2 w-full mb-6"
      />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li
              key={product.id}
              className="border rounded p-4 flex gap-4 items-center"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{product.title}</h2>
                <p className="text-gray-600 line-clamp-2">
                  {product.description || "No description"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Category: {product.category.name}
                </p>
                <p className="mt-1 font-bold">${product.price.toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination controls */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Prev
        </button>

        <span className="flex items-center">
          Page {page}
          {totalPages !== null && totalPages > 0 && ` of ${totalPages}`}
        </span>

        <button
          onClick={handleNextPage}
          disabled={totalPages !== null ? page >= totalPages : false}
          className={`px-4 py-2 rounded ${
            totalPages !== null && page >= totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// src/components/TextSearch.tsx
import { useState } from "react";
import { textSearchProducts } from "../api/textSearchApi";

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

export default function TextSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductBase[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await textSearchProducts(query, 10);
      setResults(res.data);
    } catch (error) {
      console.error("Search failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Semantic Product Search</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          placeholder="Search for a product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-1 rounded"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow">
              <img src={product.thumbnail} alt={product.title} className="w-full h-40 object-cover rounded" />
              <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
              <p className="text-sm text-gray-600">{product.description?.slice(0, 80)}...</p>
              <p className="mt-1 font-medium">${product.price}</p>
              <p className="text-sm text-gray-500">Category: {product.category.name}</p>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !loading && (
        <p className="text-gray-500">No results yet. Try searching for something.</p>
      )}
    </div>
  );
}

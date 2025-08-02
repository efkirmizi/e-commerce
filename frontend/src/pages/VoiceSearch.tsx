// src/pages/VoiceSearch.tsx
import React, { useState } from "react";
import axios from "axios";

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

const VoiceSearch: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [products, setProducts] = useState<ProductBase[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSearch = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post<{ data: ProductBase[] }>("/voice_search", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProducts(res.data.data);
    } catch (error) {
      console.error("Voice search failed", error);
      alert("Voice search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Voice Search Products</h1>

      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="block w-full border border-gray-300 rounded-md p-2 mb-4"
      />

      <button
        onClick={handleSearch}
        disabled={!file || loading}
        className={`w-full py-2 rounded-md text-white font-semibold
          ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading ? "Searching..." : "Search by Voice"}
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {products.length === 0 && !loading && (
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}

        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg">{product.title}</h2>
              <p className="text-sm text-gray-700 mt-1 line-clamp-3">{product.description || "No description"}</p>
              <p className="text-xs text-gray-500 mt-2">Category: {product.category.name}</p>
              <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceSearch;

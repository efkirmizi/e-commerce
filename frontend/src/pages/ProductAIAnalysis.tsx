import React, { useEffect, useState } from "react";
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

interface ProductsAIAnalysisOut {
  product: ProductBase;
  sentiment_score_avg: number;
  sentiment_label_counts: Record<string, number>;
  comments_summary: string;
}

interface ProductAIAnalysisProps {
  productId: number;
}

const ProductAIAnalysis: React.FC<ProductAIAnalysisProps> = ({ productId }) => {
  const [data, setData] = useState<ProductsAIAnalysisOut | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<ProductsAIAnalysisOut>(`/products/${productId}/ai_analysis`);
        setData(response.data);
      } catch (err: any) {
        if (err.response) {
          setError(err.response.data.detail || "Error fetching AI analysis");
        } else {
          setError("Network error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [productId]);

  if (loading) return <p>Loading AI analysis...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!data) return null;

  const { product, sentiment_score_avg, sentiment_label_counts, comments_summary } = data;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{product.title} - AI Analysis</h1>

      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full max-w-md rounded-md object-cover"
      />

      <section>
        <h2 className="text-xl font-semibold">Sentiment Score Average</h2>
        <p>{sentiment_score_avg.toFixed(2)}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Sentiment Label Counts</h2>
        <ul>
          {Object.entries(sentiment_label_counts).map(([label, count]) => (
            <li key={label}>
              <strong>{label}:</strong> {count}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Comments Summary</h2>
        <p>{comments_summary}</p>
      </section>
    </div>
  );
};

export default ProductAIAnalysis;

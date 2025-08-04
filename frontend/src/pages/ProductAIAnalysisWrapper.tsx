import { useParams } from "react-router-dom";
import ProductAIAnalysis from "./ProductAIAnalysis";

const ProductAIAnalysisWrapper = () => {
  const { productId } = useParams<{ productId: string }>();

  if (!productId) return <p>Invalid product ID</p>;

  const id = parseInt(productId, 10);
  if (isNaN(id)) return <p>Invalid product ID</p>;

  return <ProductAIAnalysis productId={id} />;
};

export default ProductAIAnalysisWrapper;

import { useParams } from "react-router-dom";
import ProductAIAnalysis from "./ProductAIAnalysis";

const ProductAIAnalysisWrapper = () => {
  const { productId } = useParams<{ productId: string }>();

  if (!productId) return <p>Invalid product ID</p>;

  return <ProductAIAnalysis productId={parseInt(productId, 10)} />;
};

export default ProductAIAnalysisWrapper;

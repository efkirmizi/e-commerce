// ProductCommentsWrapper.tsx
import { useParams } from "react-router-dom";
import ProductComments from "./ProductComments";

const ProductCommentsWrapper = () => {
  const { productId } = useParams();

  if (!productId) return <p>Product ID missing</p>;

  return <ProductComments productId={Number(productId)} />;
};

export default ProductCommentsWrapper;

import { useEffect, useState } from "react";
import api from "../axios"; // use the axios instance you created

// src/types/cart.ts
interface CartItemBase {
  id: number;
  product_id: number;
  quantity: number;
  subtotal: number;
}

interface CartBase {
  id: number;
  user_id: number;
  created_at: string; // datetime ISO string
  total_amount: number;
  cart_items: CartItemBase[];
}

interface CartsOutList {
  data: CartBase[];
}

interface CartItemCreate {
  product_id: number;
  quantity: number;
}

interface CartCreate {
  cart_items: CartItemCreate[];
}

const CartsList = () => {
  const [carts, setCarts] = useState<CartBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCarts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<CartsOutList>("/carts");
      setCarts(res.data.data);
    } catch (err: any) {
      setError("Failed to load carts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/carts/${id}`);
      setCarts((prev) => prev.filter((cart) => cart.id !== id));
    } catch (err: any) {
      alert("Error deleting cart");
    }
  };

  const handleAddCart = async () => {
    // For demo purposes, hardcoded cart items
    const newCart: CartCreate = {
      cart_items: [{ product_id: 1, quantity: 2 }],
    };

    try {
      await api.post("/carts", newCart);
      fetchCarts();
    } catch (err: any) {
      alert("Error creating cart");
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Carts</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleAddCart}
        disabled={loading}
      >
        + Add Cart
      </button>

      <ul className="space-y-4">
        {carts.map((cart) => (
          <li
            key={cart.id}
            className="p-4 border rounded shadow flex justify-between items-center"
          >
            <div>
              <p>
                <strong>ID:</strong> {cart.id}
              </p>
              <p>
                <strong>Total:</strong> ${cart.total_amount.toFixed(2)}
              </p>
              <p>
                <strong>Items:</strong> {cart.cart_items.length}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(cart.created_at).toLocaleString()}
              </p>
            </div>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleDelete(cart.id)}
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartsList;

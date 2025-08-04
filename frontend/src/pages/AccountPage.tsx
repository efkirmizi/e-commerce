import React, { useEffect, useState } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";

// --- Types ---
interface CartItemBase {
  id: number;
  product_id: number;
  quantity: number;
  subtotal: number;
}

interface CartBase {
  id: number;
  user_id: number;
  created_at: string;
  total_amount: number;
  cart_items: CartItemBase[];
}

interface AccountBase {
  id: number;
  username: string;
  email: string;
  fullname: string;
  role: string;
  is_active: boolean;
  created_at: string;
  carts: CartBase[];
}

interface AccountUpdate {
  username: string;
  fullname: string;
  password: string;
}

interface AccountOut extends AccountBase {}

// --- Component ---
const AccountProfile = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState<AccountOut | null>(null);
  const [form, setForm] = useState<AccountUpdate>({
    username: "",
    fullname: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  const fetchAccount = async () => {
    try {
      const res = await api.get<AccountOut>("/me/");
      setAccount(res.data);
      setForm({
        username: res.data.username,
        fullname: res.data.fullname,
        password: "",
      });
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      } else {
        setError("Failed to load account.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put<AccountOut>("/me/", form);
      setAccount(res.data);
      alert("Account updated.");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete your account permanently?");
    if (!confirmDelete) return;
    try {
      await api.delete("/me/");
      localStorage.removeItem("access_token");
      navigate("/login");
    } catch {
      alert("Failed to delete account.");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchAccount();
    }
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!account) return <p className="p-4">Account not found.</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h1 className="text-2xl font-bold">My Account</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block">Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Full Name</label>
          <input
            type="text"
            value={form.fullname}
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">New Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>

      <hr />

      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Delete Account
      </button>
    </div>
  );
};

export default AccountProfile;

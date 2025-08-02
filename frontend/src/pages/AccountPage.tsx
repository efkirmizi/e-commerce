import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// src/types/account.ts
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

interface AccountBase {
  id: number;
  username: string;
  email: string;        // EmailStr maps to string
  fullname: string;
  role: string;
  is_active: boolean;
  created_at: string;   // datetime serialized as ISO string
  carts: CartBase[];
}

interface AccountUpdate {
  username: string;
  fullname: string;
  password: string;
}

interface AccountOut extends AccountBase {}

const AccountProfile = () => {
  const [account, setAccount] = useState<AccountOut | null>(null);
  const [form, setForm] = useState<AccountUpdate>({
    username: "",
    fullname: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchAccount = async () => {
    try {
      const res = await api.get<AccountOut>("/me/");
      setAccount(res.data);
      setForm({
        username: res.data.username,
        fullname: res.data.fullname,
        password: "",
      });
    } catch (err) {
      setError("Failed to fetch account info.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put<AccountOut>("/me/", form);
      setAccount(res.data);
      alert("Account updated successfully.");
    } catch (err: any) {
      if (err.response?.data?.detail) {
        alert(err.response.data.detail);
      } else {
        alert("Update failed.");
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;
    try {
      await api.delete("/me/");
      localStorage.removeItem("token");
      navigate("/login");
    } catch {
      alert("Failed to delete account.");
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!account) return <p>No account found.</p>;

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">My Account</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block">Username:</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full border px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block">Full Name:</label>
          <input
            type="text"
            value={form.fullname}
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            className="w-full border px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block">New Password:</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border px-2 py-1"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>

      <hr className="my-4" />

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

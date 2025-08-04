import React, { useState, useEffect } from "react";
import { createCategory, fetchCategory, updateCategory } from "../api/categoryApi";
import { useNavigate, useParams } from "react-router-dom";

interface CategoryCreate {
  name: string;
}

interface CategoryUpdate {
  name: string;
}

type Props = {
  isEdit?: boolean;
};

export default function CategoryForm({ isEdit = false }: Props) {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && categoryId) {
      fetchCategory(Number(categoryId))
        .then((cat) => setName(cat.name))
        .catch(() => setError("Failed to load category"));
    }
  }, [isEdit, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && categoryId) {
        const data: CategoryUpdate = { name };
        await updateCategory(Number(categoryId), data);
      } else {
        const data: CategoryCreate = { name };
        await createCategory(data);
      }
      navigate("/categories");
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || "Failed to save category");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit" : "Create"} Category</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full p-2 border rounded mb-4"
      />

      <button
        type="submit"
        disabled={!name.trim()}
        className={`py-2 px-4 rounded ${
          !name.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        Save
      </button>
    </form>
  );
}

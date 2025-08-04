import { useEffect, useState } from "react";
import { fetchCategories, deleteCategory } from "../api/categoryApi";

interface CategoryBase {
  id: number;
  name: string;
}

export default function CategoriesList() {
  const [categories, setCategories] = useState<CategoryBase[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories(search, page, 10);
      setCategories(data.data);
      setError(null);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadCategories();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch {
      alert("Failed to delete category");
    }
  };

  return (
    <div>
      <h1>Categories</h1>

      <input
        type="text"
        placeholder="Search categories"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mb-4"
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul>
        {categories.map((cat) => (
          <li key={cat.id} className="flex justify-between items-center mb-2">
            <span>{cat.name}</span>
            <button
              onClick={() => handleDelete(cat.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-x-2">
        <button disabled={page === 1 || loading} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <button disabled={loading} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

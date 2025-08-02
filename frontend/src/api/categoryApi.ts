import axios from "axios";

// src/types/category.ts
interface CategoryBase {
  id: number;
  name: string;
}

interface CategoryCreate {
  name: string;
}

interface CategoryUpdate {
  name: string;
}

interface CategoryOut extends CategoryBase {}

interface CategoriesOut {
  data: CategoryBase[];
}

const API_URL = "http://localhost:8000/categories";

export async function fetchCategories(
  search = "",
  page = 1,
  limit = 10
): Promise<CategoriesOut> {
  const res = await axios.get<CategoriesOut>(API_URL, {
    params: { search, page, limit },
  });
  return res.data;
}

export async function fetchCategory(id: number): Promise<CategoryOut> {
  const res = await axios.get<CategoryOut>(`${API_URL}/${id}`);
  return res.data;
}

export async function createCategory(data: CategoryCreate): Promise<CategoryOut> {
  const res = await axios.post<CategoryOut>(API_URL, data);
  return res.data;
}

export async function updateCategory(
  id: number,
  data: CategoryUpdate
): Promise<CategoryOut> {
  const res = await axios.put<CategoryOut>(`${API_URL}/${id}`, data);
  return res.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}

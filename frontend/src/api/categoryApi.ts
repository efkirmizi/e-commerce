import api from "../axios";

// src/types/category.ts
export interface CategoryBase {
  id: number;
  name: string;
}

export interface CategoryCreate {
  name: string;
}

export interface CategoryUpdate {
  name: string;
}

export interface CategoryOut extends CategoryBase {}

export interface CategoriesOut {
  data: CategoryBase[];
}

const API_URL = "/categories"; // Use relative path to leverage api.baseURL

export async function fetchCategories(
  search = "",
  page = 1,
  limit = 10
): Promise<CategoriesOut> {
  const res = await api.get<CategoriesOut>(API_URL, {
    params: { search, page, limit },
  });
  return res.data;
}

export async function fetchCategory(id: number): Promise<CategoryOut> {
  const res = await api.get<CategoryOut>(`${API_URL}/${id}`);
  return res.data;
}

export async function createCategory(data: CategoryCreate): Promise<CategoryOut> {
  const res = await api.post<CategoryOut>(API_URL, data);
  return res.data;
}

export async function updateCategory(
  id: number,
  data: CategoryUpdate
): Promise<CategoryOut> {
  const res = await api.put<CategoryOut>(`${API_URL}/${id}`, data);
  return res.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`${API_URL}/${id}`);
}

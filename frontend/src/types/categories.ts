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

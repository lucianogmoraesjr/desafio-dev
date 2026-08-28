"use server";

import { apiClient } from "@/lib/api-client";
import { Category } from "@/entities/category";

export async function getCategoriesAction(
  type?: "INCOME" | "EXPENSE",
): Promise<Category[]> {
  try {
    const params = new URLSearchParams();

    if (type) {
      params.set("type", type);
    }

    return await apiClient<Category[]>(`/categories?${params.toString()}`);
  } catch {
    return [];
  }
}

type CreateCategoryDto = {
  name: string;
  type: "INCOME" | "EXPENSE";
};

export async function createCategoryAction(
  data: CreateCategoryDto,
): Promise<{ id: string }> {
  return await apiClient<{ id: string }>("/categories", {
    method: "POST",
    body: data,
  });
}

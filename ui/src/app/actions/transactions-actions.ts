"use server";

import { apiClient } from "@/lib/api-client";
import { Transaction } from "@/entities/transaction";

export type TransactionsFilters = {
  month: number;
  year: number;
  bankAccountId?: string;
  type?: Transaction["type"];
};

export async function getTransactionsAction(
  filters: TransactionsFilters,
): Promise<Transaction[]> {
  try {
    const params = new URLSearchParams();
    params.append("month", filters.month.toString());
    params.append("year", filters.year.toString());

    if (filters.bankAccountId) {
      params.append("bankAccountId", filters.bankAccountId);
    }

    if (filters.type) {
      params.append("type", filters.type);
    }

    const queryString = params.toString();

    return await apiClient<Transaction[]>(`/transactions?${queryString}`);
  } catch {
    return [];
  }
}

type CreateTransactionDto = {
  bankAccountId: string;
  categoryId?: string;
  name: string;
  valueInCents: number;
  date: Date;
  type: "INCOME" | "EXPENSE";
};

export async function createTransactionAction(
  data: CreateTransactionDto,
): Promise<Transaction> {
  return await apiClient<Transaction>("/transactions", {
    method: "POST",
    body: data,
  });
}

type EditTransactionDto = CreateTransactionDto & {
  id: string;
};

export async function updateTransactionAction(
  data: EditTransactionDto,
): Promise<void> {
  const { id, ...body } = data;
  return await apiClient(`/transactions/${id}`, {
    method: "PUT",
    body,
  });
}

export async function deleteTransactionAction(id: string): Promise<void> {
  return await apiClient(`/transactions/${id}`, {
    method: "DELETE",
  });
}

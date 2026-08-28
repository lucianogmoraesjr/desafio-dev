"use server";

import { apiClient } from "@/lib/api-client";
import { BankAccount } from "@/entities/bank-account";

export async function getBankAccountsAction(): Promise<BankAccount[]> {
  try {
    return await apiClient<BankAccount[]>("/bank-accounts");
  } catch {
    return [];
  }
}

type CreateBankAccountDto = {
  name: string;
  initialBalanceInCents: number;
  type: "CHECKING" | "INVESTMENT" | "CASH";
  color: string;
};

export async function createBankAccountAction(
  data: CreateBankAccountDto,
): Promise<BankAccount> {
  return await apiClient<BankAccount>("/bank-accounts", {
    method: "POST",
    body: data,
  });
}

type EditBankAccountDto = CreateBankAccountDto & {
  id: string;
};

export async function updateBankAccountAction(
  data: EditBankAccountDto,
): Promise<void> {
  const { id, ...body } = data;
  return await apiClient(`/bank-accounts/${id}`, {
    method: "PUT",
    body,
  });
}

export async function deleteBankAccountAction(id: string): Promise<void> {
  return await apiClient(`/bank-accounts/${id}`, {
    method: "DELETE",
  });
}

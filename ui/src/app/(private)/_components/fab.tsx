"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { NewAccountDialog } from "./dialogs/new-account-dialog";
import { NewTransactionDialog } from "./dialogs/new-transaction-dialog";
import { useState } from "react";
import { BankAccountIcon } from "./icons/BankAccountIcon";
import { CategoryIcon } from "./icons/categories/CategoryIcon";
import { useBankAccounts } from "@/hooks/use-bank-accounts";

export function Fab() {
  const [type, setType] = useState<"income" | "expense">("income");
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

  const { accounts } = useBankAccounts();

  const handleOpenNewTransactionDialog = (type: "income" | "expense") => {
    setType(type);
    setTransactionDialogOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label="Criar novo"
                className="flex items-center justify-center rounded-full bg-teal-900 p-3 text-center text-white"
              >
                <Plus className="size-6" />
              </button>
            }
          />

          <DropdownMenuContent className="mb-4 mr-4 w-52">
            <DropdownMenuItem
              className="gap-3 items-center p-3"
              onClick={() => handleOpenNewTransactionDialog("income")}
              disabled={accounts.length === 0}
            >
              <CategoryIcon type="income" className="size-8" />
              Nova Receita
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-3 items-center p-3"
              onClick={() => handleOpenNewTransactionDialog("expense")}
              disabled={accounts.length === 0}
            >
              <CategoryIcon type="expense" className="size-8" />
              Nova Despesa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-3 items-center p-3"
              onClick={() => setAccountDialogOpen(true)}
            >
              <BankAccountIcon className="size-8" />
              Nova Conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {accountDialogOpen && (
        <NewAccountDialog
          open={accountDialogOpen}
          onOpenChange={setAccountDialogOpen}
        />
      )}

      <NewTransactionDialog
        type={type}
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
      />
    </>
  );
}

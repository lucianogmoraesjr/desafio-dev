import { Transaction } from "@/entities/transaction";
import { CategoryIcon } from "../icons/categories/CategoryIcon";
import { cn, currencyFormatter, dateFormatter } from "@/lib/utils";
import { useState } from "react";
import { EditTransactionDialog } from "../dialogs/edit-transaction-dialog";

interface TransactionCardProps {
  transaction: Transaction;
  valueVisible?: boolean;
}

export function TransactionCard({
  transaction,
  valueVisible = true,
}: TransactionCardProps) {
  const [editTransactionDialogOpen, setEditTransactionDialogOpen] =
    useState(false);

  return (
    <>
      <div
        key={transaction.id}
        className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-white p-4"
        role="button"
        onClick={() => setEditTransactionDialogOpen(true)}
      >
        <div className="flex flex-1 gap-3">
          <CategoryIcon
            type={transaction.type === "INCOME" ? "income" : "expense"}
            category={transaction.category?.icon}
          />

          <div className="flex flex-col">
            <strong className="text-gray-800">{transaction.name}</strong>
            <span className="text-sm text-gray-600">
              {dateFormatter(new Date(transaction.date))}
            </span>
          </div>
        </div>

        <span
          className={cn(
            "font-medium",
            transaction.type === "INCOME" ? "text-green-800" : "text-red-800",
            !valueVisible && "blur-md",
          )}
        >
          {transaction.type === "INCOME" ? "+ " : "- "}
          {currencyFormatter.format(transaction.valueInCents / 100)}
        </span>
      </div>

      <EditTransactionDialog
        open={editTransactionDialogOpen}
        onOpenChange={setEditTransactionDialogOpen}
        transaction={transaction}
      />
    </>
  );
}

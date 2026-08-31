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
        className="flex flex-col cursor-pointer md:items-center md:justify-between gap-4 rounded-2xl bg-white p-4 md:flex-row"
        role="button"
        onClick={() => setEditTransactionDialogOpen(true)}
      >
        <div className="flex flex-1 gap-2 md:gap-3">
          <div>
            <CategoryIcon
              type={transaction.type === "INCOME" ? "income" : "expense"}
              category={transaction.category?.icon}
              className="size-8 md:size-10"
            />
          </div>

          <div className="flex flex-col overflow-hidden">
            <strong className="text-gray-800 truncate">
              {transaction.name}
            </strong>
            <span className="text-sm text-gray-600">
              {dateFormatter(new Date(transaction.date))}
            </span>
          </div>
        </div>

        <span
          className={cn(
            "font-medium self-end",
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

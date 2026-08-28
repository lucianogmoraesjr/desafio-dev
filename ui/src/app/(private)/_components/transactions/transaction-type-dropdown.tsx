import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransactionsIcon } from "../icons/TransactionsIcon";
import { ChevronDown } from "lucide-react";
import { CategoryIcon } from "../icons/categories/CategoryIcon";

interface TransactionTypeDropdownProps {
  onSelect: (type: "INCOME" | "EXPENSE" | undefined) => void;
  selectedType: "INCOME" | "EXPENSE" | undefined;
}

export function TransactionTypeDropdown({
  onSelect,
  selectedType,
}: TransactionTypeDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button type="button" className="flex items-center gap-2">
            {selectedType === "INCOME" && (
              <>
                <CategoryIcon type="income" className="size-8" />
                <span className="text-sm font-medium text-gray-800">
                  Receitas
                </span>
              </>
            )}

            {selectedType === "EXPENSE" && (
              <>
                <CategoryIcon type="expense" className="size-8" />
                <span className="text-sm font-medium text-gray-800">
                  Despesas
                </span>
              </>
            )}

            {selectedType === undefined && (
              <>
                <TransactionsIcon className="size-8" />
                <span className="text-sm font-medium text-gray-800">
                  Transações
                </span>
              </>
            )}

            <ChevronDown className="size-6 text-gray-900" />
          </button>
        }
      />

      <DropdownMenuContent className="mt-2 w-64">
        <DropdownMenuItem
          className="gap-2 p-3"
          onClick={() => onSelect("INCOME")}
        >
          <CategoryIcon type="income" className="size-8" />
          Receitas
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 p-3"
          onClick={() => onSelect("EXPENSE")}
        >
          <CategoryIcon type="expense" className="size-8" />
          Despesas
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 p-3"
          onClick={() => onSelect(undefined)}
        >
          <TransactionsIcon className="size-8" />
          Transações
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

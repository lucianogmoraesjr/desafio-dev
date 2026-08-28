import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBankAccounts } from "@/hooks/use-bank-accounts";
import { cn } from "@/lib/utils";

interface FiltersDialogProps {
  onApplyFilters: (filters: {
    bankAccountId: string | undefined;
    year: number;
  }) => void;
}

export function FiltersDialog({ onApplyFilters }: FiltersDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<
    string | undefined
  >(undefined);

  const { accounts } = useBankAccounts();

  const handleSelectBankAccount = (bankAccountId: string) => {
    setSelectedBankAccountId((prevState) =>
      prevState === bankAccountId ? undefined : bankAccountId,
    );
  };

  const handleChangeYear = (step: number) => {
    setSelectedYear((prevState) => prevState + step);
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      bankAccountId: selectedBankAccountId,
      year: selectedYear,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={"ghost"} size={"icon"}>
            <Filter className="text-neutral-800 size-6" />
          </Button>
        }
      />

      <DialogContent>
        <DialogTitle>Filtros</DialogTitle>

        <div>
          <span className="font-medium">Conta</span>
          <div className="mt-2 space-y-2">
            {accounts.map((bankAccount) => (
              <button
                key={bankAccount.id}
                type="button"
                onClick={() => handleSelectBankAccount(bankAccount.id)}
                className={cn(
                  "w-full rounded-2xl p-2 text-left hover:bg-gray-50",
                  bankAccount.id === selectedBankAccountId && "!bg-gray-200",
                )}
              >
                {bankAccount.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="font-medium">Ano</span>

          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => handleChangeYear(-1)}
            >
              <ChevronLeft className="size-6 text-neutral-600" />
            </button>

            <span className="flex-1 text-center text-sm font-medium">
              {selectedYear}
            </span>

            <button
              type="button"
              aria-label="Próximo"
              onClick={() => handleChangeYear(+1)}
            >
              <ChevronRight className="size-6 text-neutral-600" />
            </button>
          </div>
        </div>

        <Button className="mt-4 w-full" onClick={handleApplyFilters}>
          Aplicar Filtros
        </Button>
      </DialogContent>
    </Dialog>
  );
}

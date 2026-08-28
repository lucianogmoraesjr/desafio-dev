import z from "zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBankAccounts } from "@/hooks/use-bank-accounts";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { CurrencyInput } from "@/components/currency-input";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { useCategories } from "@/hooks/use-categories";
import { createTransactionAction } from "@/app/actions/transactions-actions";
import { currencyFormatter } from "@/lib/utils";
import { NewCategoryDialog } from "./new-category-dialog";

const schema = z.object({
  value: z.string().min(1, "O valor é obrigatório"),
  name: z.string().min(1, "O nome é obrigatório"),
  categoryId: z.string().optional(),
  bankAccountId: z.string().min(1, "A conta é obrigatória"),
  date: z.date({
    invalid_type_error: "A data é obrigatória",
    message: "A data é obrigatória",
  }),
});

type FormData = z.infer<typeof schema>;

interface NewTransactionDialogProps {
  type: "income" | "expense";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTransactionDialog({
  type,
  onOpenChange,
  open,
}: NewTransactionDialogProps) {
  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);

  const isIncome = type === "income";
  const { accounts } = useBankAccounts();
  const { categories } = useCategories(isIncome ? "INCOME" : "EXPENSE");

  const accountItems = useMemo(
    () => accounts.map((a) => ({ label: a.name, value: a.id })),
    [accounts],
  );

  const categoryItems = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c.id })),
    [categories],
  );

  const {
    register,
    reset,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      value: "0",
      bankAccountId: "",
    },
  });

  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: createTransactionAction,
  });

  const handleOpenChange = () => {
    onOpenChange(false);
    reset();
  };

  const handleCreateCategorySuccess = (categoryId: string) => {
    setValue("categoryId", categoryId);
  };

  const handleSubmit = hookFormSubmit(async ({ value, ...data }) => {
    try {
      await mutateAsync({
        ...data,
        valueInCents: currencyFormatter.parse(value),
        type: isIncome ? "INCOME" : "EXPENSE",
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });

      toast.add({
        type: "success",
        description: isIncome
          ? "Receita cadastrada com sucesso!"
          : "Despesa cadastrada com sucesso!",
      });
    } catch {
      toast.add({
        type: "error",
        description: "Ocorreu um erro ao cadastrar a transação",
      });
    } finally {
      handleOpenChange();
    }
  });

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isIncome ? "Nova Receita" : "Nova Despesa"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <span className="text-xs text-gray-600">
                  Valor da {isIncome ? "receita" : "despesa"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-600">R$</span>
                  <Controller
                    control={control}
                    name="value"
                    render={({ field: { onChange, value } }) => (
                      <CurrencyInput
                        error={errors.value?.message}
                        onChange={onChange}
                        value={value}
                      />
                    )}
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Nome</FieldLabel>
                <Input
                  placeholder={isIncome ? "Ex: Salário" : "Ex: Mercado"}
                  {...register("name")}
                />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field>
                <FieldLabel>Categoria</FieldLabel>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      items={categoryItems}
                      value={value || ""}
                      onValueChange={(value) => {
                        if (value === "NEW_CATEGORY") {
                          setNewCategoryDialogOpen(true);
                          return;
                        }
                        onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categoryItems.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>

                        <SelectSeparator />

                        <SelectGroup>
                          <SelectItem
                            value="NEW_CATEGORY"
                            className="text-primary"
                          >
                            <div className="flex items-center gap-2">
                              <Plus className="size-4" />
                              Criar categoria
                            </div>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                <FieldError errors={[errors.categoryId]} />
              </Field>

              <Field>
                <FieldLabel>Conta</FieldLabel>
                <Controller
                  control={control}
                  name="bankAccountId"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      items={accountItems}
                      value={value || ""}
                      onValueChange={onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma conta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {accountItems.map((account) => (
                            <SelectItem
                              key={account.value}
                              value={account.value}
                            >
                              {account.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                <FieldError errors={[errors.bankAccountId]} />
              </Field>

              <Field>
                <FieldLabel>Data</FieldLabel>
                <Controller
                  control={control}
                  name="date"
                  render={({ field: { value, onChange } }) => (
                    <DatePicker value={value} onChange={onChange} />
                  )}
                />
                <FieldError errors={[errors.date]} />
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-6">
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <NewCategoryDialog
        open={newCategoryDialogOpen}
        onOpenChange={setNewCategoryDialogOpen}
        onSuccess={handleCreateCategorySuccess}
        type={type}
      />
    </>
  );
}

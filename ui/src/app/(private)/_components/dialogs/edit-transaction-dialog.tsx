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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { useCategories } from "@/hooks/use-categories";
import {
  deleteTransactionAction,
  updateTransactionAction,
} from "@/app/actions/transactions-actions";
import { currencyFormatter } from "@/lib/utils";
import { Transaction } from "@/entities/transaction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface EditTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
}

export function EditTransactionDialog({
  transaction,
  onOpenChange,
  open,
}: EditTransactionDialogProps) {
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [unsavedAlertOpen, setUnsavedAlertOpen] = useState(false);

  const isIncome = transaction.type === "INCOME";
  const { accounts } = useBankAccounts();
  const { categories } = useCategories(transaction.type);

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
    formState: { errors, isDirty },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      name: transaction.name,
      bankAccountId: transaction.bankAccountId,
      categoryId: transaction.category?.id,
      date: new Date(transaction.date),
      value: (transaction.valueInCents / 100).toString(),
    },
  });

  const queryClient = useQueryClient();

  const { isPending: isUpdatePending, mutateAsync: updateMutate } = useMutation(
    {
      mutationFn: updateTransactionAction,
    },
  );

  const { isPending: isDeletePending, mutateAsync: deleteMutate } = useMutation(
    {
      mutationFn: deleteTransactionAction,
    },
  );

  const handleOpenChange = (open: boolean) => {
    if (!open && isDirty) {
      setUnsavedAlertOpen(true);
      return;
    }

    onOpenChange(open);
    if (!open) reset();
  };

  const handleDiscardChanges = () => {
    setUnsavedAlertOpen(false);
    reset();
    onOpenChange(false);
  };

  const handleSubmit = hookFormSubmit(async ({ value, ...data }) => {
    try {
      await updateMutate({
        id: transaction.id,
        ...data,
        valueInCents: currencyFormatter.parse(value),
        type: isIncome ? "INCOME" : "EXPENSE",
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });

      toast.add({
        type: "success",
        description: isIncome
          ? "Receita atualizada com sucesso!"
          : "Despesa atualizada com sucesso!",
      });
    } catch {
      toast.add({
        type: "error",
        description: "Ocorreu um erro ao salvar as alterações",
      });
    } finally {
      reset();
      onOpenChange(false);
    }
  });

  const handleDelete = async () => {
    try {
      await deleteMutate(transaction.id);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });

      toast.add({
        type: "success",
        description: `${isIncome ? "Receita" : "Despesa"} excluída com sucesso`,
      });
    } catch {
      toast.add({
        type: "error",
        description: `Ocorreu um erro ao excluir a ${isIncome ? "receita" : "despesa"}`,
      });
    } finally {
      setDeleteAlertOpen(false);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>
              {isIncome ? "Editar Receita" : "Editar Despesa"}
            </DialogTitle>

            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => setDeleteAlertOpen(true)}
              aria-label="Excluir transação"
              className="bg-transparent"
            >
              <Trash2 className="size-4" />
            </Button>
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
                      onValueChange={onChange}
                    >
                      <SelectTrigger disabled={categoryItems.length === 0}>
                        <SelectValue
                          placeholder={
                            categoryItems.length > 0
                              ? "Selecione uma categoria"
                              : "Nenhuma categoria disponível"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryItems.length > 0 && (
                          <SelectGroup>
                            {categoryItems.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )}
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

            <DialogFooter className="mt-6 flex !flex-col">
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 w-full"
                disabled={isUpdatePending}
              >
                {isUpdatePending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>

              <Button
                onClick={() => handleOpenChange(false)}
                type="button"
                variant="ghost"
                className="text-neutral-600"
              >
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a{" "}
              {isIncome ? "receita" : "despesa"}{" "}
              <strong className="text-gray-900"> {transaction.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeletePending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletePending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                `Sim, excluir a ${isIncome ? "receita" : "despesa"}`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={unsavedAlertOpen} onOpenChange={setUnsavedAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você modificou alguns dados desta{" "}
              {isIncome ? "receita" : "despesa"}. Se você sair agora, todas as
              alterações não salvas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDiscardChanges}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

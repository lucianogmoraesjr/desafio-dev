import { ColorsDropdown } from "@/components/colors-dropdown";
import { CurrencyInput } from "@/components/currency-input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import {
  deleteBankAccountAction,
  updateBankAccountAction,
} from "@/app/actions/bank-accounts-actions";
import { currencyFormatter } from "@/lib/utils";
import { options } from "@/config/constants";
import { BankAccount } from "@/entities/bank-account";
import { useState } from "react";
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
  initialBalance: z.string().min(1, "Saldo inicial é obrigatório"),
  name: z.string().min(1, "Nome da conta é obrigatório"),
  type: z.enum(["CHECKING", "INVESTMENT", "CASH"]),
  color: z.string().min(1, "Cor é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface EditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: BankAccount;
}

export function EditAccountDialog({
  onOpenChange,
  open,
  account,
}: EditAccountDialogProps) {
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [unsavedAlertOpen, setUnsavedAlertOpen] = useState(false);

  const {
    register,
    reset,
    handleSubmit: hookFormSubmit,
    formState: { errors, isDirty },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      name: account.name,
      initialBalance: (account.initialBalanceInCents / 100).toString(),
      color: account.color,
      type: account.type,
    },
  });

  const queryClient = useQueryClient();

  const { isPending: isUpdatePending, mutateAsync: updateMutate } = useMutation(
    {
      mutationFn: updateBankAccountAction,
    },
  );

  const { isPending: isDeletePending, mutateAsync: deleteMutate } = useMutation(
    {
      mutationFn: deleteBankAccountAction,
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

  const handleSubmit = hookFormSubmit(async ({ initialBalance, ...data }) => {
    try {
      await updateMutate({
        id: account.id,
        ...data,
        initialBalanceInCents: currencyFormatter.parse(initialBalance),
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });

      toast.add({
        type: "success",
        description: "Conta atualizada com sucesso",
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
      await deleteMutate(account.id);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });

      toast.add({ type: "success", description: "Conta excluída com sucesso" });
    } catch {
      toast.add({
        type: "error",
        description: "Ocorreu um erro ao excluir a conta",
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>Editar Conta</DialogTitle>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => setDeleteAlertOpen(true)}
                aria-label="Excluir conta"
                className="bg-transparent"
              >
                <Trash2 className="size-4" />
              </Button>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <span className="text-xs text-gray-600">Saldo inicial</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-600">R$</span>
                  <Controller
                    control={control}
                    name="initialBalance"
                    render={({ field: { onChange, value } }) => (
                      <CurrencyInput
                        error={errors.initialBalance?.message}
                        onChange={onChange}
                        value={value}
                      />
                    )}
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Nome da conta</FieldLabel>
                <Input placeholder="Ex: Banco Digital" {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field>
                <FieldLabel>Tipo</FieldLabel>
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      items={options}
                      value={value}
                      onValueChange={onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.type]} />
              </Field>

              <Field>
                <FieldLabel>Cor</FieldLabel>
                <Controller
                  control={control}
                  name="color"
                  render={({ field: { value, onChange } }) => (
                    <ColorsDropdown
                      value={value}
                      onChange={onChange}
                      error={errors.color?.message}
                    />
                  )}
                />
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-6 flex !flex-col">
              <Button
                type="submit"
                className="w-full"
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
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a
              conta
              <strong className="text-gray-900"> {account.name}</strong> e
              removerá todos os dados associados a ela.
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
                "Sim, excluir conta"
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
              Você modificou alguns dados desta conta. Se você sair agora, todas
              as alterações não salvas serão perdidas.
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

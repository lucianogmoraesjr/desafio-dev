import { ColorsDropdown } from "@/components/colors-dropdown";
import { CurrencyInput } from "@/components/currency-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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

import { createBankAccountAction } from "@/app/actions/bank-accounts-actions";
import { currencyFormatter } from "@/lib/utils";
import { options } from "@/config/constants";

const schema = z.object({
  initialBalance: z.string().min(1, "Saldo inicial é obrigatório"),
  name: z.string().min(1, "Nome da conta é obrigatório"),
  type: z.enum(["CHECKING", "INVESTMENT", "CASH"]),
  color: z.string().min(1, "Cor é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface NewAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAccountDialog({
  onOpenChange,
  open,
}: NewAccountDialogProps) {
  const {
    register,
    reset,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      initialBalance: "0",
      color: "",
      type: "CHECKING",
    },
  });

  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: createBankAccountAction,
  });

  const handleOpenChange = () => {
    onOpenChange(false);
    reset();
  };

  const handleSubmit = hookFormSubmit(async ({ initialBalance, ...data }) => {
    try {
      await mutateAsync({
        ...data,
        initialBalanceInCents: currencyFormatter.parse(initialBalance),
      });

      queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });

      toast.add({
        type: "success",
        description: "Conta cadastrada com sucesso",
      });
    } catch {
      toast.add({
        type: "error",
        description: "Ocorreu um erro ao cadastrar a conta",
      });
    } finally {
      handleOpenChange();
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nova Conta</DialogTitle>
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

          <DialogFooter className="mt-6">
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Cadastrar Conta"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

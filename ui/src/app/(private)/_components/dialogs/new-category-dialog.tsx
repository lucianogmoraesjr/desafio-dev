import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { createCategoryAction } from "@/app/actions/categories-actions";

const schema = z.object({
  name: z.string().min(1, "O nome da categoria é obrigatório"),
  icon: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface NewCategoryDialogProps {
  type: "income" | "expense";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (categoryId: string) => void;
}

export function NewCategoryDialog({
  type,
  open,
  onOpenChange,
  onSuccess,
}: NewCategoryDialogProps) {
  const isIncome = type === "income";
  const queryClient = useQueryClient();

  const {
    register,
    reset,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", icon: "" },
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: createCategoryAction,
  });

  const handleSubmit = hookFormSubmit(async ({ name }) => {
    try {
      const { id } = await mutateAsync({
        name,
        type: isIncome ? "INCOME" : "EXPENSE",
      });

      queryClient.invalidateQueries({ queryKey: ["categories"] });

      toast.add({
        type: "success",
        description: "Categoria criada com sucesso!",
      });

      onSuccess?.(id);
    } catch {
      toast.add({
        type: "error",
        description: "Erro ao criar categoria.",
      });
    } finally {
      onOpenChange(false);
      reset();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              Nova Categoria de {isIncome ? "Receita" : "Despesa"}
            </DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel>Nome da categoria</FieldLabel>
              <Input placeholder="Ex: Lazer" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Cadastrar Categoria"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

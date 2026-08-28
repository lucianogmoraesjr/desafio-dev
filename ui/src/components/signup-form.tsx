import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SignupFormData, signupSchema } from "@/lib/schemas/auth";
import { signupAction } from "@/app/actions/auth-actions";
import { Loader2 } from "lucide-react";
import { AlertDestructive } from "./alert-destructive";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    setServerError(null);
    const result = await signupAction(data);

    if (result?.error) {
      setServerError(result.error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center mb-2">
          <h1 className="text-2xl font-bold tracking-tight">Crie sua conta</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Preencha seus dados para começar a gerenciar suas finanças
          </p>
        </div>

        {serverError && <AlertDestructive title={serverError} />}

        <Field>
          <FieldLabel htmlFor="name">Nome completo</FieldLabel>
          <Input
            type="text"
            placeholder="Seu nome"
            className="bg-background"
            {...register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            type="email"
            placeholder="seu@email.com"
            className="bg-background"
            {...register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            type="password"
            placeholder="********"
            className="bg-background"
            {...register("password")}
          />
          <FieldDescription>
            A senha deve ter no mínimo 8 caracteres.
          </FieldDescription>
          <FieldError errors={[errors.password]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirmar senha</FieldLabel>
          <Input
            type="password"
            placeholder="********"
            className="bg-background"
            {...register("confirmPassword")}
          />
          <FieldError errors={[errors.confirmPassword]} />
        </Field>

        <Field className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando sua conta...
              </>
            ) : (
              "Criar conta"
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="px-6 text-center mt-2">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 font-medium text-emerald-600 hover:text-emerald-700"
            >
              Entrar
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}

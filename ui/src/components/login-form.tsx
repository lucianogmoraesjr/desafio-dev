"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signinAction } from "@/app/actions/auth-actions";
import { SigninFormData, signinSchema } from "@/lib/schemas/auth";
import { AlertDestructive } from "./alert-destructive";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  async function onSubmit(data: SigninFormData) {
    setServerError(null);
    const result = await signinAction(data);

    if (result?.error) {
      setServerError(result.error);
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center mb-2">
        <h1 className="text-2xl font-bold tracking-tight">Acesse sua conta</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Informe seu e-mail e senha para gerenciar suas finanças
        </p>
      </div>

      {serverError && <AlertDestructive title={serverError} />}

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          E-mail
        </label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          disabled={isSubmitting}
          {...register("email")}
        />
        {errors.email && (
          <span className="text-xs text-destructive">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium">
          Senha
        </label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          disabled={isSubmitting}
          {...register("password")}
        />
        {errors.password && (
          <span className="text-xs text-destructive">
            {errors.password.message}
          </span>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-2">
        Ainda não tem uma conta?{" "}
        <Link
          href="/signup"
          className="underline underline-offset-4 font-medium text-emerald-600 hover:text-emerald-700"
        >
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}

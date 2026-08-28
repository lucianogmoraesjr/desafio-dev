import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center mb-2">
          <h1 className="text-2xl font-bold tracking-tight">Crie sua conta</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Preencha seus dados para começar a gerenciar suas finanças
          </p>
        </div>
        
        <Field>
          <FieldLabel htmlFor="name">Nome completo</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome"
            required
            className="bg-background"
          />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            required
            className="bg-background"
          />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="********"
            required
            className="bg-background"
          />
          <FieldDescription>
            A senha deve ter no mínimo 8 caracteres.
          </FieldDescription>
        </Field>
        
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirmar senha</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            placeholder="********"
            required
            className="bg-background"
          />
        </Field>
        
        <Field className="pt-2">
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
            Criar conta
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
  )
}
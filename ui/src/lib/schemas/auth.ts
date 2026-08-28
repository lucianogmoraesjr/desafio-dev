import { z } from 'zod'

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório.')
    .email('Informe um e-mail válido.'),
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.'),
})

export type SigninFormData = z.infer<typeof signinSchema>

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, 'O nome deve ter no mínimo 2 caracteres.')
      .trim(),
    email: z
      .string()
      .min(1, 'O e-mail é obrigatório.')
      .email('Informe um e-mail válido.'),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres.'),
    confirmPassword: z
      .string()
      .min(1, 'Confirme sua senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

export type SignupFormData = z.infer<typeof signupSchema>
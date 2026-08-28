"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  signinSchema,
  signupSchema,
  SigninFormData,
  SignupFormData,
} from "@/lib/schemas/auth";
import { apiClient, ApiError } from "@/lib/api-client";

type ActionResponse = { error?: string };

export async function signinAction(
  data: SigninFormData,
): Promise<ActionResponse> {
  const validatedFields = signinSchema.safeParse(data);

  if (!validatedFields.success) return { error: "Dados inválidos." };

  try {
    const { accessToken } = await apiClient<{ accessToken: string }>(
      "/auth/signin",
      {
        method: "POST",
        body: validatedFields.data,
      },
    );

    const cookieStore = await cookies();

    cookieStore.set("session", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 1,
    });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    return { error: "Falha ao conectar com o servidor." };
  }

  redirect("/");
}

export async function signupAction(
  data: SignupFormData,
): Promise<ActionResponse> {
  const validatedFields = signupSchema.safeParse(data);

  if (!validatedFields.success) return { error: "Dados inválidos." };

  const { name, email, password } = validatedFields.data;

  try {
    await apiClient("/auth/signup", {
      method: "POST",
      body: { name, email, password },
    });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    return { error: "Falha ao conectar com o servidor." };
  }

  redirect("/login");
}

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SignupFormData, SigninFormData } from "@/lib/schemas/auth";
import { ApiError, publicApiClient } from "@/lib/api-client";

type ActionResponse = { error?: string };

export async function signinAction(
  data: SigninFormData,
): Promise<ActionResponse> {
  try {
    const { accessToken } = await publicApiClient<{ accessToken: string }>(
      "/auth/signin",
      {
        method: "POST",
        body: data,
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
    if (error instanceof ApiError && error.statusCode === 401) {
      return { error: "Credenciais inválidas" };
    }

    return { error: "Falha ao conectar com o servidor." };
  }

  redirect("/");
}

export async function signupAction(
  data: SignupFormData,
): Promise<ActionResponse> {
  const { name, email, password } = data;

  try {
    await publicApiClient("/auth/signup", {
      method: "POST",
      body: { name, email, password },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.statusCode) {
        case 409:
          return { error: "Este e-mail já está em uso." };

        default:
          return { error: "Erro desconhecido." };
      }
    }

    return { error: "Falha ao conectar com o servidor." };
  }

  redirect("/login");
}

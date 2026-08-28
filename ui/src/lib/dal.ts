import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { apiClient } from "./api-client";

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  return token;
});

export const getUser = cache(async () => {
  await verifySession();

  try {
    const user = await apiClient<{ id: string; name: string; email: string }>(
      "/users/me",
    );

    return user;
  } catch {}
});

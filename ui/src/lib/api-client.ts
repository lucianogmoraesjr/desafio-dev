import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type ApiClientOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

export async function apiClient<T>(
  endpoint: string,
  { body, ...customConfig }: ApiClientOptions = {},
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const headers = new Headers(customConfig.headers);

  if (!headers.has("Content-Type") && body) {
    headers.set("Content-Type", "application/json");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(`${baseUrl}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      redirect("/api/signout");
    }

    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      errorData?.message ?? "Ocorreu um erro inesperado na requisição.",
      response.status,
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

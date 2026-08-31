import "server-only";
import { cookies, headers } from "next/headers";
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

async function fetchClient<T>(
  endpoint: string,
  options: RequestInit,
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const reqHeaders = new Headers(options.headers);
  const incomingHeaders = await headers();
  const forwardedFor = incomingHeaders.get("x-forwarded-for");
  if (forwardedFor) reqHeaders.set("x-forwarded-for", forwardedFor);

  const finalOptions: RequestInit = {
    ...options,
    headers: reqHeaders,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, finalOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    const errorMessage = Array.isArray(errorData?.message)
      ? errorData.message[0]
      : (errorData?.message ?? "Ocorreu um erro inesperado na requisição.");

    throw new ApiError(errorMessage, response.status);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

export async function publicApiClient<T>(
  endpoint: string,
  { body, ...customConfig }: ApiClientOptions = {},
): Promise<T> {
  const headers = new Headers(customConfig.headers);
  if (!headers.has("Content-Type") && body)
    headers.set("Content-Type", "application/json");

  const config: RequestInit = {
    ...customConfig,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  return fetchClient<T>(endpoint, config);
}

export async function apiClient<T>(
  endpoint: string,
  { body, ...customConfig }: ApiClientOptions = {},
): Promise<T> {
  const headers = new Headers(customConfig.headers);

  if (!headers.has("Content-Type") && body) {
    headers.set("Content-Type", "application/json");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const config: RequestInit = {
    ...customConfig,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    return await fetchClient<T>(endpoint, config);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      redirect("/api/signout");
    }
    throw error;
  }
}

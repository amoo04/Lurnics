const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new ApiError(json.error?.message ?? "Request failed", json.error?.code);
  }

  return json.data as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  return handleResponse<T>(res);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(res);
}

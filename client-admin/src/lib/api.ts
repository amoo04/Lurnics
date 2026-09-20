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
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
  });
  return handleResponse<T>(res);
}

function withBody(method: string) {
  return async function request<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  };
}

export const apiPost = withBody("POST");
export const apiPatch = withBody("PATCH");
export const apiPut = withBody("PUT");

export async function apiUpload<T>(path: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return handleResponse<T>(res);
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<T>(res);
}

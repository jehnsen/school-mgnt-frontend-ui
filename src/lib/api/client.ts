/*
  Live API client for the K-12 School Management backend (Laravel + Sanctum).

  - Reads the base URL from NEXT_PUBLIC_API_BASE_URL (default http://localhost/api).
  - Attaches the Bearer token from the in-memory cache or localStorage.
  - Normalizes errors into ApiError (with status + parsed body, incl. Laravel
    validation `errors`).
  - Unwraps the common Laravel `{ data, meta, links }` envelope where present.
*/

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost/api";

export const TOKEN_KEY = "akademya_token";

/* -------------------------------- token -------------------------------- */

let memoryToken: string | null = null;

export function setAuthToken(token: string | null) {
  memoryToken = token;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }
}

export function getAuthToken(): string | null {
  if (memoryToken) return memoryToken;
  if (typeof window !== "undefined") {
    memoryToken = localStorage.getItem(TOKEN_KEY);
  }
  return memoryToken;
}

/* -------------------------------- errors ------------------------------- */

export class ApiError extends Error {
  status: number;
  data: unknown;
  validation?: Record<string, string[]>;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    if (
      data &&
      typeof data === "object" &&
      "errors" in data &&
      (data as { errors?: unknown }).errors
    ) {
      this.validation = (data as { errors: Record<string, string[]> }).errors;
    }
  }
}

/* ------------------------------ query string --------------------------- */

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export function toQuery(params?: QueryParams): string {
  if (!params) return "";
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      usp.append(key, String(value));
    }
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

/* ------------------------------- core fetch ---------------------------- */

interface RequestOptions {
  method?: string;
  body?: unknown;
  params?: QueryParams;
  signal?: AbortSignal;
  /** Skip JSON serialization (used for FormData uploads). */
  formData?: FormData;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, params, signal, formData } = options;
  const token = getAuthToken();

  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined && !formData) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}${toQuery(params)}`, {
      method,
      headers,
      signal,
      body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError(
      0,
      "Cannot reach the API. Is the backend running and CORS configured?",
    );
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    // Session expired — clear token so the app can redirect to login.
    if (res.status === 401 && typeof window !== "undefined") {
      setAuthToken(null);
    }
    const message =
      (parsed && typeof parsed === "object" && "message" in parsed
        ? String((parsed as { message: unknown }).message)
        : null) ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, message, parsed);
  }

  return parsed as T;
}

/* ------------------------------ public api ----------------------------- */

export const api = {
  get: <T>(path: string, params?: QueryParams, signal?: AbortSignal) =>
    request<T>(path, { method: "GET", params, signal }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body }),
  del: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "DELETE", body }),
  upload: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: "POST", formData }),
};

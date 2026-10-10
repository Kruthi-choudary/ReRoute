const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
const TOKEN_KEY = "reroute_token";

const USER_KEY = "reroute_user";

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init.headers ?? {}) as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (res.status === 401 && token) {
    // Session expired or invalid — clear it and force a fresh login
    // rather than letting callers silently treat this as "no data".
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "/login";
  }
  return res;
}

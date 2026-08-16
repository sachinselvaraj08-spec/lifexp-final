/**
 * Central API client for LifeXP frontend → Express backend communication.
 * All requests are authenticated with a Firebase ID token.
 */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// ─────────────────────────────────────────────────────────────────────────────
// Core fetch wrapper
// ─────────────────────────────────────────────────────────────────────────────
async function request<T>(
  method: string,
  path: string,
  token: string,
  body?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      message = json.error ?? json.message ?? message;
    } catch {
      // response body was not JSON – keep the status string
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported API methods
// ─────────────────────────────────────────────────────────────────────────────
export const api = {
  get: <T>(path: string, token: string): Promise<T> =>
    request<T>("GET", path, token),

  post: <T>(
    path: string,
    token: string,
    body: Record<string, unknown>
  ): Promise<T> => request<T>("POST", path, token, body),

  put: <T>(
    path: string,
    token: string,
    body: Record<string, unknown>
  ): Promise<T> => request<T>("PUT", path, token, body),

  delete: <T>(path: string, token: string): Promise<T> =>
    request<T>("DELETE", path, token),
};

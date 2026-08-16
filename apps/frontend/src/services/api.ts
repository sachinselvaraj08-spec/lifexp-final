/**
 * Central API client for LifeXP frontend → Express backend communication.
 * All requests are authenticated with a Firebase ID token.
 */

function getBackendUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  return rawUrl.replace(/\/+$/, "");
}

// ─────────────────────────────────────────────────────────────────────────────
// Core fetch wrapper
// ─────────────────────────────────────────────────────────────────────────────
async function request<T>(
  method: string,
  path: string,
  token: string,
  body?: Record<string, unknown>
): Promise<T> {
  const baseUrl = getBackendUrl();
  const fullUrl = `${baseUrl}${path}`;

  let res: Response;
  try {
    res = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err: any) {
    console.error(`[API Wrapper] Network error connecting to ${fullUrl}:`, err);
    throw new Error(
      `Network Error connecting to backend (${baseUrl}). Check NEXT_PUBLIC_BACKEND_URL.`
    );
  }

  if (!res.ok) {
    let message = `HTTP ${res.status} ${res.statusText}`;
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

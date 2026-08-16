/**
 * Central API client for LifeXP frontend → Express backend communication.
 * All requests are authenticated with a Firebase ID token.
 */

import { auth as clientAuth } from "./firebase";

function getBackendUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  return rawUrl.replace(/\/+$/, "");
}

/**
 * Resolves a valid, unexpired Firebase ID token.
 * If providedToken is absent or invalid, tries auth.currentUser.getIdToken().
 */
async function resolveToken(providedToken?: string | null, forceRefresh = false): Promise<string | null> {
  if (providedToken && providedToken.trim() && !forceRefresh) {
    return providedToken;
  }
  if (clientAuth.currentUser) {
    try {
      return await clientAuth.currentUser.getIdToken(forceRefresh);
    } catch (err) {
      console.error("[API Wrapper] Failed to resolve Firebase ID token:", err);
    }
  }
  return providedToken || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core fetch wrapper with 401 Token Refresh Retry
// ─────────────────────────────────────────────────────────────────────────────
async function request<T>(
  method: string,
  path: string,
  token?: string | null,
  body?: Record<string, unknown>,
  isRetry = false
): Promise<T> {
  const baseUrl = getBackendUrl();
  const fullUrl = `${baseUrl}${path}`;
  const activeToken = await resolveToken(token, isRetry);

  if (!activeToken) {
    throw new Error("No authentication token available. Please sign in.");
  }

  let res: Response;
  try {
    res = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeToken}`,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err: any) {
    console.error(`[API Wrapper] Network error connecting to ${fullUrl}:`, err);
    throw new Error(
      `Network Error connecting to backend (${baseUrl}). Check NEXT_PUBLIC_BACKEND_URL.`
    );
  }

  // Handle 401 Unauthorized — attempt 1 silent force-refresh retry if user is signed in
  if (res.status === 401 && !isRetry && clientAuth.currentUser) {
    console.warn("[API Wrapper] HTTP 401 received. Attempting silent Firebase token refresh retry...");
    return request<T>(method, path, null, body, true);
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
  get: <T>(path: string, token?: string | null): Promise<T> =>
    request<T>("GET", path, token),

  post: <T>(
    path: string,
    token: string | null | undefined,
    body: Record<string, unknown>
  ): Promise<T> => request<T>("POST", path, token, body),

  put: <T>(
    path: string,
    token: string | null | undefined,
    body: Record<string, unknown>
  ): Promise<T> => request<T>("PUT", path, token, body),

  delete: <T>(path: string, token?: string | null): Promise<T> =>
    request<T>("DELETE", path, token),
};

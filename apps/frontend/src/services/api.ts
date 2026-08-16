/**
 * Central API client for LifeXP frontend → Express backend communication.
 * All requests are authenticated with a Firebase ID token.
 */

import { auth as clientAuth } from "./firebase";

function getBackendUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://lifexp-backend-finalz.vercel.app";
  return rawUrl.replace(/\/+$/, "");
}

/**
 * Resolves a fresh Firebase ID token directly from clientAuth.currentUser.
 */
async function getFreshToken(forceRefresh = false): Promise<string> {
  const user = clientAuth.currentUser;
  if (!user) {
    throw new Error("User is not authenticated");
  }
  const token = await user.getIdToken(forceRefresh);
  if (!token) {
    throw new Error("Failed to retrieve Firebase ID token");
  }
  return token;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core fetch wrapper with 10s AbortController timeout & 401 Silent Retry
// ─────────────────────────────────────────────────────────────────────────────
async function request<T>(
  method: string,
  path: string,
  body?: Record<string, unknown>,
  isRetry = false
): Promise<T> {
  const baseUrl = getBackendUrl();
  const fullUrl = `${baseUrl}${path}`;

  // Safe frontend logging (NEVER logs token itself)
  console.log("[AUTH DEBUG]", {
    authenticated: !!clientAuth.currentUser,
    uid: clientAuth.currentUser?.uid ?? null,
    projectId: clientAuth.app.options.projectId,
  });

  console.log("[API DEBUG]", {
    endpoint: fullUrl,
    authenticated: !!clientAuth.currentUser,
    uid: clientAuth.currentUser?.uid ?? null,
  });

  const activeToken = await getFreshToken(isRetry);

  // 10-second request timeout guard
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let res: Response;
  try {
    res = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeToken}`,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: "no-store",
    });

    console.log("[API DEBUG]", {
      status: res.status,
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === "AbortError") {
      throw new Error(`Request to ${fullUrl} timed out after 10s.`);
    }
    console.error(`[API Wrapper] Network error connecting to ${fullUrl}:`, err);
    throw new Error(
      `Network Error connecting to backend (${baseUrl}). Check NEXT_PUBLIC_BACKEND_URL.`
    );
  } finally {
    clearTimeout(timeoutId);
  }

  // Handle 401 Unauthorized — attempt 1 force-refresh retry if user is signed in
  if (res.status === 401 && !isRetry && clientAuth.currentUser) {
    console.warn("[API DEBUG] 401 Unauthorized received. Attempting single retry with force-refreshed token (getIdToken(true))...");
    return request<T>(method, path, body, true);
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
  get: <T>(path: string, _tokenIgnored?: string | null): Promise<T> =>
    request<T>("GET", path),

  post: <T>(
    path: string,
    _tokenOrBody?: string | null | Record<string, unknown>,
    body?: Record<string, unknown>
  ): Promise<T> => {
    const actualBody =
      typeof _tokenOrBody === "object" && _tokenOrBody !== null
        ? _tokenOrBody
        : body;
    return request<T>("POST", path, actualBody);
  },

  put: <T>(
    path: string,
    _tokenOrBody?: string | null | Record<string, unknown>,
    body?: Record<string, unknown>
  ): Promise<T> => {
    const actualBody =
      typeof _tokenOrBody === "object" && _tokenOrBody !== null
        ? _tokenOrBody
        : body;
    return request<T>("PUT", path, actualBody);
  },

  delete: <T>(path: string, _tokenIgnored?: string | null): Promise<T> =>
    request<T>("DELETE", path),
};


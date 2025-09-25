 /**
  * PUBLIC_INTERFACE
  * apiClient
  * Centralized API client for the frontend. Manages the backend API base URL (persisted in
  * localStorage) and provides helper functions to call backend endpoints. Also provides a
  * health check function used by the online/offline indicator.
  *
  * Env var default: REACT_APP_API_BASE can set the initial URL if localStorage is empty.
  */
const STORAGE_KEY = "kb_api_base_url";

const defaultBase =
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE) ||
  "";

let apiBase = localStorage.getItem(STORAGE_KEY) || defaultBase;

/**
 * PUBLIC_INTERFACE
 * getApiBase
 * Returns the current backend API base URL used by the frontend for all requests.
 */
export function getApiBase() {
  return apiBase;
}

/**
 * PUBLIC_INTERFACE
 * setApiBase
 * Sets and persists the backend API base URL. All subsequent API calls should use this value.
 */
export function setApiBase(url) {
  apiBase = (url || "").trim();
  localStorage.setItem(STORAGE_KEY, apiBase);
}

/**
 * PUBLIC_INTERFACE
 * apiFetch
 * Thin wrapper around fetch() that prefixes requests with the configured API base URL.
 * Accepts input similar to fetch: (path, options). Path should start with '/'.
 */
export async function apiFetch(path, options = {}) {
  if (!path.startsWith("/")) {
    throw new Error("apiFetch path must start with '/'");
  }
  const base = getApiBase();
  if (!base) {
    // Provide clear error to the user/developer to configure backend URL
    throw new Error(
      "Backend API base URL is not set. Click the status indicator to configure it."
    );
  }
  const url = base.replace(/\/+$/, "") + path;

  // default headers
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const resp = await fetch(url, { ...options, headers });
  const contentType = resp.headers.get("content-type") || "";
  let body = null;
  if (contentType.includes("application/json")) {
    body = await resp.json().catch(() => null);
  } else {
    body = await resp.text().catch(() => null);
  }
  if (!resp.ok) {
    const errMsg =
      (body && (body.detail || body.message || JSON.stringify(body))) ||
      `Request failed with status ${resp.status}`;
    const error = new Error(errMsg);
    error.status = resp.status;
    error.body = body;
    throw error;
  }
  return body;
}

/**
 * PUBLIC_INTERFACE
 * healthCheck
 * Pings the backend root endpoint '/' and returns true if online, false otherwise.
 */
export async function healthCheck() {
  try {
    await apiFetch("/", { method: "GET", headers: { "Content-Type": "application/json" } });
    return true;
  } catch (_e) {
    return false;
  }
}

/**
 * PUBLIC_INTERFACE
 * authLogin
 * POST /auth/login with { email, password }. Returns { access_token, token_type }.
 */
export async function authLogin({ email, password }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * PUBLIC_INTERFACE
 * authSignup
 * POST /auth/signup with { email, password, full_name? }. Returns profile or success info.
 */
export async function authSignup({ email, password, full_name }) {
  return apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name: full_name || null }),
  });
}

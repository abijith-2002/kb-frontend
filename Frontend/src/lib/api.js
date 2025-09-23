/**
 * PUBLIC_INTERFACE
 * apiFetch
 * Wraps window.fetch to target the Backend base URL (REACT_APP_API_BASE), automatically
 * attaching JSON headers and credentials as needed. Use for future chat/message endpoints.
 */
export async function apiFetch(path, options = {}) {
  const base = process.env.REACT_APP_API_BASE;
  if (!base) {
    // Soft-fail in development (no hard throw) so UI continues to function with stubs.
    // eslint-disable-next-line no-console
    console.warn("[api] REACT_APP_API_BASE not set; request skipped:", path);
    return { ok: false, skipped: true };
  }
  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  return res;
}

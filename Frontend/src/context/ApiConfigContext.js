import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * ApiConfigContext
 * React context to manage API base URL and provide utilities like health checks.
 * It allows runtime updates to the API base so all future requests use the new value.
 */
const ApiConfigContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * ApiConfigProvider
 * Context provider that stores the current API base URL and provides methods
 * to get/set it and to check backend health.
 */
export function ApiConfigProvider({ children }) {
  // Initialize from env (safe default) or localStorage override
  const ENV_BASE = process.env.REACT_APP_API_BASE || "";
  const stored = typeof window !== "undefined" ? window.localStorage.getItem("apiBaseUrl") : null;
  const [apiBaseUrl, setApiBaseUrl] = useState(stored || ENV_BASE);

  // Persist setting
  useEffect(() => {
    try {
      if (apiBaseUrl) {
        window.localStorage.setItem("apiBaseUrl", apiBaseUrl);
      } else {
        window.localStorage.removeItem("apiBaseUrl");
      }
    } catch (_e) {
      // ignore
    }
  }, [apiBaseUrl]);

  // PUBLIC_INTERFACE
  const updateApiBaseUrl = useCallback((next) => {
    // normalize: trim trailing slash
    const norm = (next || "").trim().replace(/\/+$/, "");
    setApiBaseUrl(norm);
  }, []);

  // Health check with fallback path
  const controllerRef = useRef(null);

  // PUBLIC_INTERFACE
  const checkHealth = useCallback(async () => {
    // Abort previous in-flight
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    const base = apiBaseUrl || "";
    const candidates = ["/health", "/"];
    let lastErr;
    for (const path of candidates) {
      const url = `${base}${path}`;
      try {
        const res = await fetch(url, { method: "GET", signal: controllerRef.current.signal });
        if (res.ok) {
          // try to parse json, but tolerate text
          try {
            const data = await res.json();
            return { ok: true, data };
          } catch (_e) {
            const txt = await res.text();
            return { ok: true, data: txt };
          }
        } else {
          lastErr = new Error(`${res.status} ${res.statusText}`);
        }
      } catch (e) {
        lastErr = e;
      }
    }
    return { ok: false, error: lastErr?.message || "Unknown error" };
  }, [apiBaseUrl]);

  const value = useMemo(
    () => ({
      apiBaseUrl,
      setApiBaseUrl: updateApiBaseUrl,
      checkHealth,
      getApiBaseUrl: () => apiBaseUrl,
    }),
    [apiBaseUrl, updateApiBaseUrl, checkHealth]
  );

  return <ApiConfigContext.Provider value={value}>{children}</ApiConfigContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useApiConfig
 * Hook to access API config context.
 */
export function useApiConfig() {
  const ctx = useContext(ApiConfigContext);
  if (!ctx) {
    throw new Error("useApiConfig must be used within ApiConfigProvider");
  }
  return ctx;
}

export default ApiConfigContext;

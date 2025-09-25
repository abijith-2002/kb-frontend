import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getApiBase, setApiBase, healthCheck } from "./apiClient";

/**
 * PUBLIC_INTERFACE
 * ApiConfigProvider
 * React context provider that tracks API base URL and online/offline status.
 * Provides methods to update the base URL and to control the settings dialog visibility.
 */
const ApiConfigContext = createContext(null);

export function ApiConfigProvider({ children, pollIntervalMs = 10000 }) {
  const [apiBaseUrl, setApiBaseUrl] = useState(getApiBase());
  const [online, setOnline] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Poll health status
  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const ok = await healthCheck();
      if (!cancelled) setOnline(ok);
    }
    // initial ping
    poll();
    const id = setInterval(poll, pollIntervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [apiBaseUrl, pollIntervalMs]);

  const updateBase = (url) => {
    setApiBase(url);
    setApiBaseUrl(url);
  };

  const value = useMemo(
    () => ({
      apiBaseUrl,
      online,
      setDialogOpen,
      dialogOpen,
      setApiBaseUrl: updateBase,
    }),
    [apiBaseUrl, online, dialogOpen]
  );

  return <ApiConfigContext.Provider value={value}>{children}</ApiConfigContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useApiConfig
 * Hook to access API base URL, online status, and dialog controls.
 */
export function useApiConfig() {
  const ctx = useContext(ApiConfigContext);
  if (!ctx) throw new Error("useApiConfig must be used within ApiConfigProvider");
  return ctx;
}

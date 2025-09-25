import { useEffect, useRef, useState } from "react";
import { useApiConfig } from "../lib/useApiConfig";

/**
 * PUBLIC_INTERFACE
 * ApiStatusAndConfig
 * A persistent corner indicator showing online/offline status. Clicking opens a modal dialog
 * allowing the user to configure the backend API base URL (persisted in localStorage).
 */
export default function ApiStatusAndConfig() {
  const { online, apiBaseUrl, setApiBaseUrl, dialogOpen, setDialogOpen } = useApiConfig();
  const [tempUrl, setTempUrl] = useState(apiBaseUrl || "");
  const dialogRef = useRef(null);

  useEffect(() => {
    setTempUrl(apiBaseUrl || "");
  }, [apiBaseUrl, dialogOpen]);

  const badgeColor = online ? "bg-emerald-500/90" : "bg-rose-500/90";
  const badgeText = online ? "Online" : "Offline";

  const onOpen = () => setDialogOpen(true);
  const onClose = () => setDialogOpen(false);

  const onSave = () => {
    setApiBaseUrl(tempUrl.trim());
    setDialogOpen(false);
  };

  const onBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <>
      {/* Floating status pill */}
      <button
        className={`fixed bottom-4 right-4 z-40 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-md hover:opacity-95 transition ${badgeColor}`}
        title="Click to configure backend API base URL"
        onClick={onOpen}
        aria-label="Backend connectivity status"
      >
        {badgeText}
      </button>

      {/* Modal dialog */}
      {dialogOpen && (
        <div
          ref={dialogRef}
          onClick={onBackdropClick}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="api-config-title"
        >
          <div className="w-full max-w-lg rounded-2xl bg-app-surfaceAlt border border-app-border p-6 shadow-lg">
            <div className="mb-4">
              <h2 id="api-config-title" className="text-lg font-semibold text-app-onbg">
                Configure Backend API
              </h2>
              <p className="text-sm text-app-onbg-muted mt-1">
                Set the base URL for the backend. All API requests (including auth) will use this.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-wide text-app-onbg-muted">
                API Base URL
              </label>
              <input
                className="input"
                type="text"
                placeholder="https://your-backend.example.com"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                autoFocus
              />
              <p className="text-xs text-app-onbg-muted">
                Current: <span className="text-app-primary">{apiBaseUrl || "(not set)"}</span>
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button className="btn-secondary px-3 py-2" onClick={onClose}>
                Cancel
              </button>
              <button className="btn px-3 py-2" onClick={onSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

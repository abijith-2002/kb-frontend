 /** 
  * PUBLIC_INTERFACE
  * NavBar
  * Responsive navigation bar that shows app name, backend connection status with periodic health checks,
  * an API settings dialog to edit the API base URL, and logout action when authenticated.
  */
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import supabase from "../lib/supabaseClient";
import { useApiConfig } from "../context/ApiConfigContext";

function StatusDot({ status = "unknown" }) {
  /** Tiny colored dot: green when online, red when offline, gray when unknown */
  const color =
    status === "online"
      ? "var(--success)"
      : status === "offline"
      ? "rgba(200,80,80,0.95)"
      : "rgba(255,255,255,0.45)";
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: 999,
        background: color,
        boxShadow: status === "online" ? "0 0 0 2px rgba(33,196,124,0.25)" : "none",
      }}
    />
  );
}

/** Simple centered modal/dialog for API base URL config */
function ApiSettingsModal({ open, onClose }) {
  const { apiBaseUrl, setApiBaseUrl, checkHealth } = useApiConfig();
  const [value, setValue] = useState(apiBaseUrl || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      setValue(apiBaseUrl || "");
      setMsg("");
      setErr("");
    }
  }, [open, apiBaseUrl]);

  const submit = async (e) => {
    e?.preventDefault?.();
    setSaving(true);
    setMsg("");
    setErr("");
    try {
      setApiBaseUrl(value);
      // Verify connectivity after saving
      const res = await checkHealth();
      if (res.ok) {
        setMsg("Saved. Backend is reachable.");
        setTimeout(() => onClose?.(), 700);
      } else {
        setErr(`Saved, but health check failed: ${res.error || "Unknown error"}`);
      }
    } catch (e2) {
      setErr(e2.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal panel */}
      <div
        className="relative bg-panel-elev border-subtle round-12"
        style={{ width: "min(560px, 92vw)", padding: 16 }}
      >
        <div className="flex items-start justify-between">
          <h2 id="api-settings-title" className="text-primary text-lg font-semibold">
            API Settings
          </h2>
          <button
            className="btn-ghost round-10"
            style={{ height: 30, padding: "0 10px" }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <p className="text-tertiary text-sm" style={{ marginTop: 8 }}>
          Set the backend API base URL (e.g., http://localhost:3001).
        </p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs text-tertiary mb-1">API Base URL</label>
            <input
              className="w-full input-dark round-10"
              placeholder="http://localhost:3001"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ height: 40, padding: "0 12px" }}
            />
          </div>
          {msg && (
            <div className="text-xs" style={{ color: "var(--link)" }} aria-live="polite">
              {msg}
            </div>
          )}
          {err && (
            <div className="text-xs text-red-400/90" role="alert" aria-live="assertive">
              {err}
            </div>
          )}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              className="btn-ghost round-10"
              style={{ height: 36, padding: "0 12px" }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-accent round-10"
              style={{ height: 36, padding: "0 14px" }}
              disabled={saving}
              aria-busy={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NavBar() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const { apiBaseUrl, checkHealth } = useApiConfig();

  const [status, setStatus] = useState("unknown"); // "online" | "offline" | "unknown"
  const [modalOpen, setModalOpen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setAuthed(!!data.session);
      setEmail(data.session?.user?.email || "");
    }
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAuthed(!!session);
      setEmail(session?.user?.email || "");
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Periodic backend health check
  const runHealth = useCallback(async () => {
    try {
      const res = await checkHealth();
      setStatus(res.ok ? "online" : "offline");
    } catch (_e) {
      setStatus("offline");
    }
  }, [checkHealth]);

  useEffect(() => {
    runHealth();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(runHealth, 8000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [apiBaseUrl, runHealth]);

  const doLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const statusLabel = status === "online" ? "Online" : status === "offline" ? "Offline" : "Unknown";

  return (
    <nav className="bg-transparent">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="font-bold text-app-primary hover:text-app-primaryDark text-lg transition-colors"
        >
          KnowledgeBot
        </Link>
        <div className="flex items-center gap-4">
          {/* Status indicator - click to open settings modal */}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 btn-ghost round-10"
            style={{ height: 32, padding: "0 10px" }}
            title={`Backend status: ${statusLabel}. Click to edit API base.`}
            aria-label="Backend connection status and API settings"
          >
            <StatusDot status={status} />
            <span className="text-xs text-secondary">{statusLabel}</span>
          </button>

          {authed ? (
            <>
              <span className="text-sm text-app-onbg-muted">{email}</span>
              <button className="btn" onClick={doLogout}>
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* Settings Modal */}
      <ApiSettingsModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </nav>
  );
}

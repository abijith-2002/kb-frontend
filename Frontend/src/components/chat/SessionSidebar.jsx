import { Fragment } from "react";

/**
 * PUBLIC_INTERFACE
 * SessionSidebar
 * Left sidebar listing chat sessions with the ability to create a new session.
 * Props:
 *  - sessions: Array<{ id: string, title?: string | null }>
 *  - loading: boolean
 *  - error: string
 *  - activeSessionId: string
 *  - onCreateSession: () => void
 *  - creating: boolean
 *  - onSelectSession: (id: string) => void
 */
export default function SessionSidebar({
  sessions,
  loading,
  error,
  activeSessionId,
  onCreateSession,
  creating,
  onSelectSession,
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-app-border">
        <button
          className="btn w-full"
          onClick={onCreateSession}
          disabled={creating}
          aria-busy={creating}
        >
          {creating ? "Creating..." : "New Chat"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-3 text-sm text-app-onbg-muted">Loading sessions...</div>
        ) : error ? (
          <div className="p-3 text-xs text-red-400">{error}</div>
        ) : sessions.length === 0 ? (
          <div className="p-3 text-sm text-app-onbg-muted">
            No sessions yet. Create one to begin.
          </div>
        ) : (
          <ul className="py-2">
            {sessions.map((s) => (
              <li key={s.id}>
                <button
                  className={`w-full text-left px-3 py-2 hover:bg-app-surface ${
                    s.id === activeSessionId ? "bg-app-surface text-app-primary" : ""
                  }`}
                  onClick={() => onSelectSession(s.id)}
                >
                  <div className="text-sm truncate">{s.title || "Untitled chat"}</div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 border-t border-app-border text-[10px] text-app-onbg-muted">
        Tip: Upload files in the input bar to reference them in your questions.
      </div>
    </div>
  );
}

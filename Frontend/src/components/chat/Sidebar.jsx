import React, { useMemo, useState } from "react";
import { PlusIcon, SearchIcon } from "./Icons";

/**
 * PUBLIC_INTERFACE
 * Sidebar
 * Left sidebar with New Chat button, Search input, and Chat list.
 * Styles follow assets/chat_window_design_notes.md (300px width, tokens, spacing).
 *
 * Props:
 *  - sessions: array of sessions
 *  - activeId: current active session id
 *  - onCreate: () => void to create new session
 *  - onSelect: (id) => void to switch session
 */
export default function Sidebar({ sessions = [], activeId, onCreate, onSelect }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return sessions;
    return sessions.filter((s) => (s.title || "Untitled").toLowerCase().includes(term));
  }, [q, sessions]);

  return (
    <aside
      className="h-full border-r-subtle bg-[#111B18] text-secondary"
      style={{ width: 300 }}
      aria-label="Sidebar Navigation"
    >
      <div className="flex flex-col h-full gap-4" style={{ padding: "16px" }}>
        {/* Top Action: New Chat */}
        <div>
          <button
            type="button"
            className="inline-flex items-center gap-2 round-12 btn-accent"
            style={{ height: 36, padding: "0 12px" }}
            aria-label="Start a new chat"
            onClick={onCreate}
          >
            <PlusIcon size={16} stroke="#0E1613" />
            <span className="text-[14px] font-semibold">New chat</span>
          </button>
        </div>

        {/* Group: Chats */}
        <nav className="flex-1 overflow-y-auto" aria-label="Chats">
          <div className="text-[12.5px] font-semibold uppercase tracking-wider text-tertiary" style={{ marginBottom: 10 }}>
            Chats
          </div>

          {/* Search input */}
          <div className="relative" role="search">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary">
              <SearchIcon size={15} />
            </span>
            <input
              className="w-full round-10 input-dark"
              placeholder="Search"
              style={{ height: 36, paddingLeft: 38, paddingRight: 12 }}
              aria-label="Search chats"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {/* Chat list */}
          <div className="mt-3 flex flex-col gap-2" role="list">
            {filtered.length === 0 ? (
              <div
                className="w-full text-left round-10"
                style={{
                  minHeight: 44,
                  padding: "10px 14px",
                  color: "var(--text-tertiary)",
                }}
                role="note"
              >
                No chats found
              </div>
            ) : (
              filtered.map((s) => {
                const isActive = s.id === activeId;
                return (
                  <button
                    key={s.id}
                    className="w-full text-left round-10"
                    style={{
                      minHeight: 44,
                      padding: "10px 14px",
                      background: isActive ? "var(--surface-muted)" : "transparent",
                      color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    }}
                    role="listitem"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => onSelect?.(s.id)}
                    title={s.title || "Untitled"}
                  >
                    {s.title || "Untitled"}
                  </button>
                );
              })
            )}
          </div>

          {/* Explore prompts group (non-interactive placeholders per spec, no pills in thread) */}
          <div className="mt-6">
            <div className="text-[12.5px] font-semibold uppercase tracking-wider text-tertiary" style={{ marginBottom: 10 }}>
              Explore prompts
            </div>
            <div className="flex flex-col">
              {["Usage guidance", "Ideas", "Prompts", "Templates"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="round-10"
                  style={{
                    height: 34,
                    padding: "8px 12px",
                    color: "var(--text-secondary)",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}

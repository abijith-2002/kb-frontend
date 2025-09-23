import React from "react";
import { PlusIcon, SearchIcon } from "./icons";

/**
 * PUBLIC_INTERFACE
 * ChatSidebar
 * Left sidebar with "New chat" button, search, session list, and prompt exploration links.
 * Props:
 *  - sessions: array of {id, title}
 *  - activeSessionId: string | null
 *  - onNewChat: function()
 *  - onSelectSession: function(id)
 */
export default function ChatSidebar({
  sessions = [{ id: "default", title: "KnowledgeBot" }],
  activeSessionId = "default",
  onNewChat = () => {},
  onSelectSession = () => {},
}) {
  return (
    <aside
      className="hidden md:flex flex-col h-[100vh] min-h-0 border-r"
      style={{
        width: "280px",
        background: "var(--sidebar-surface)",
        borderRight: "1px solid var(--border-subtle)",
      }}
      aria-label="Sidebar"
    >
      <div className="flex-1 min-h-0 p-4 flex flex-col gap-4">
        {/* New chat */}
        <div>
          <button
            onClick={onNewChat}
            className="w-full inline-flex items-center justify-center gap-2 font-semibold"
            style={{
              height: "38px",
              background: "var(--accent)",
              color: "#0C1613",
              borderRadius: "12px",
            }}
          >
            <PlusIcon size={16} className="text-[#0C1613]" />
            <span style={{ fontSize: "14px" }}>New chat</span>
          </button>
        </div>

        {/* Chats group */}
        <nav className="flex-1 overflow-auto min-h-0">
          <div className="mb-3">
            <div
              className="uppercase"
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: "var(--text-tertiary)",
                margin: "8px 0 10px 2px",
              }}
            >
              Chats
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-icon)]">
                <SearchIcon size={16} />
              </div>
              <input
                aria-label="Search chats"
                placeholder="Search"
                className="w-full outline-none"
                style={{
                  height: "36px",
                  paddingLeft: "36px",
                  paddingRight: "12px",
                  background: "var(--input-bg)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "10px",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Sessions list */}
            <div className="mt-3 flex flex-col gap-2">
              {sessions.map((s) => {
                const active = s.id === activeSessionId;
                return (
                  <button
                    key={s.id}
                    onClick={() => onSelectSession(s.id)}
                    className="w-full text-left transition-colors"
                    style={{
                      height: "42px",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      background: active ? "var(--surface-elevated)" : "transparent",
                      color: active ? "var(--text-primary)" : "var(--text-secondary)",
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    {s.title || "Untitled"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explore prompts */}
          <div className="mt-6">
            <div
              className="uppercase"
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: "var(--text-tertiary)",
                margin: "8px 0 10px 2px",
              }}
            >
              Explore prompts
            </div>
            <div className="flex flex-col gap-1.5">
              {["Usage guidance", "Ideas", "Prompts", "Templates"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="transition-colors"
                  style={{
                    height: "34px",
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
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

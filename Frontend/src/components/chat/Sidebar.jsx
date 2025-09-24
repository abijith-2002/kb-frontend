import React from "react";
import { PlusIcon, SearchIcon } from "./Icons";

/**
 * PUBLIC_INTERFACE
 * Sidebar
 * Left sidebar with New Chat button, Search input, and Chat list.
 * Styles follow assets/chat_window_design_notes.md (300px width, tokens, spacing).
 */
export default function Sidebar() {
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
            />
          </div>

          {/* Chat list */}
          <div className="mt-3 flex flex-col gap-2" role="list">
            <button
              className="w-full text-left round-10"
              style={{
                minHeight: 44,
                padding: "10px 14px",
                background: "var(--surface-muted)",
                color: "var(--text-primary)",
              }}
              role="listitem"
              aria-current="true"
            >
              KnowledgeBot
            </button>
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

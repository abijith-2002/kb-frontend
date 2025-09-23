import React from "react";
import { ChevronRightIcon } from "./icons";

/**
 * PUBLIC_INTERFACE
 * ActionChip
 * Small outlined pill button used within assistant message blocks.
 * Props:
 *  - label: string
 *  - onClick: function
 */
export function ActionChip({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5"
      style={{
        height: "30px",
        padding: "0 12px",
        borderRadius: "999px",
        border: "1px solid rgba(103,230,161,0.35)",
        color: "var(--accent)",
        background: "transparent",
        fontSize: "13px",
        fontWeight: 600,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--badge-bg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <span>{label}</span>
      <ChevronRightIcon size={14} className="text-[var(--accent)]" />
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * ChatMessage
 * Renders a single message bubble/card.
 * Props:
 *  - role: "assistant" | "user"
 *  - content: ReactNode
 */
export default function ChatMessage({ role = "assistant", content }) {
  const isAssistant = role === "assistant";
  const baseStyle = isAssistant
    ? {
        background: "var(--panel-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "14px",
        padding: "16px",
      }
    : {
        background: "transparent",
        borderRadius: "14px",
        padding: "6px 2px",
      };

  return (
    <article
      className="msg"
      style={{
        ...baseStyle,
        color: isAssistant ? "var(--text-secondary)" : "var(--text-primary)",
        fontSize: "15px",
        lineHeight: 1.6,
      }}
    >
      {content}
    </article>
  );
}

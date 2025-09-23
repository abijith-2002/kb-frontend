import React, { useEffect, useRef, useState } from "react";
import { PlusIcon, SendIcon } from "./icons";

/**
 * PUBLIC_INTERFACE
 * Composer
 * Bottom sticky composer with + button, multiline textarea, and send button.
 * Props:
 *  - onSend: function(messageText)
 *  - disabled: boolean
 */
export default function Composer({ onSend, disabled = false }) {
  const [text, setText] = useState("");
  const taRef = useRef(null);

  // Auto-resize up to 4 lines
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    const maxHeight = parseInt(getComputedStyle(ta).lineHeight, 10) * 4;
    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + "px";
  }, [text]);

  const canSend = !!text.trim() && !disabled;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        onSend?.(text.trim());
        setText("");
      }
    }
  };

  return (
    <footer className="sticky bottom-4 z-[5] px-3 sm:px-4">
      <div
        className="mx-auto"
        style={{ maxWidth: "1040px" }}
      >
        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: "auto 1fr auto",
            gap: "12px",
            background: "var(--surface-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "16px",
            padding: "10px",
          }}
        >
          {/* Left action */}
          <button
            aria-label="Add"
            title="Add"
            className="inline-flex items-center justify-center"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "999px",
              background: "var(--input-bg)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <PlusIcon size={16} />
          </button>

          {/* Textarea */}
          <textarea
            ref={taRef}
            rows={1}
            placeholder="Type your message..."
            className="w-full bg-transparent outline-none resize-none"
            style={{
              color: "var(--text-primary)",
              fontSize: "15px",
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />

          {/* Send */}
          <button
            aria-label="Send"
            title="Send"
            onClick={() => {
              if (canSend) {
                onSend?.(text.trim());
                setText("");
              }
            }}
            disabled={!canSend}
            className="inline-flex items-center justify-center transition-colors"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "999px",
              background: canSend ? "var(--accent)" : "rgba(103,230,161,0.35)",
              color: "#0C1613",
            }}
            onMouseEnter={(e) => {
              if (canSend) e.currentTarget.style.background = "var(--accent-strong)";
            }}
            onMouseLeave={(e) => {
              if (canSend) e.currentTarget.style.background = "var(--accent)";
            }}
          >
            <SendIcon size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}

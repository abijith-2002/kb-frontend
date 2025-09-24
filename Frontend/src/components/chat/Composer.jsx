import React, { useMemo, useRef } from "react";
import { PaperclipIcon, PlusIcon, SendIcon } from "./Icons";

/**
 * PUBLIC_INTERFACE
 * Composer
 * Bottom input composer with attachment button and text input, matching pill-rectangle style and tokens.
 */
export default function Composer({ value, onChange, onSend, onUpload, isSending = false, disabled = false }) {
  const fileRef = useRef(null);
  const canSend = useMemo(() => (value || "").trim().length > 0 && !isSending && !disabled, [value, isSending, disabled]);

  const openPicker = () => fileRef.current?.click();

  const onFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length && onUpload) onUpload(files);
    // reset value to allow re-selecting same file
    e.target.value = "";
  };

  const submit = (e) => {
    e?.preventDefault?.();
    if (canSend && onSend) onSend();
  };

  return (
    <footer
      className="relative"
      aria-label="Composer"
      style={{ padding: "0 24px 16px" }}
    >
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <form
          onSubmit={submit}
          className="grid items-center border-subtle bg-panel-elev"
          style={{
            gridTemplateColumns: "auto 1fr auto",
            gap: 12,
            padding: 12,
            borderRadius: 16,
          }}
          aria-label="Message composer form"
        >
          {/* Left: Attach */}
          <div>
            <button
              type="button"
              className="btn-icon round-pill inline-flex items-center justify-center"
              style={{ width: 36, height: 36 }}
              aria-label="Attach files"
              onClick={openPicker}
            >
              <PlusIcon size={16} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".docx,.pdf,.txt,.xlsx"
              multiple
              className="hidden"
              onChange={onFileChange}
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>

          {/* Textarea */}
          <div>
            <textarea
              className="w-full resize-none bg-transparent outline-none text-primary placeholder:text-tertiary"
              placeholder="Type your message…"
              rows={1}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              style={{ fontSize: 15, lineHeight: 1.5 }}
              aria-label="Message input"
            />
          </div>

          {/* Send */}
          <div>
            <button
              type="submit"
              className="round-pill inline-flex items-center justify-center"
              style={{
                width: 38,
                height: 38,
                background: canSend ? "var(--accent)" : "rgba(35,196,131,0.35)",
              }}
              aria-label="Send message"
              disabled={!canSend}
            >
              <SendIcon size={16} stroke={canSend ? "#0E1613" : "rgba(14,22,19,0.6)"} />
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
}

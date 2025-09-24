import React from "react";

/**
 * PUBLIC_INTERFACE
 * Thread
 * Scrollable thread container. Does not include any demo messages.
 */
export default function Thread({ children }) {
  return (
    <section
      className="overflow-auto"
      aria-label="Chat Thread"
      style={{ padding: "20px 24px 92px" }}
    >
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

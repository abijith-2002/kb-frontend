import React from "react";

/**
 * PUBLIC_INTERFACE
 * ChatHeader
 * Header area showing the bot title. Styled per design notes.
 */
export default function ChatHeader() {
  return (
    <header
      className="flex items-center justify-between"
      style={{ height: 60, padding: "0 20px" }}
      aria-label="Chat Header"
    >
      <h1 className="text-primary font-semibold" style={{ fontSize: 20 }}>
        KnowledgeBot
      </h1>
      {/* Intentionally not rendering header CTA pills per instruction */}
      <div aria-hidden="true" />
    </header>
  );
}

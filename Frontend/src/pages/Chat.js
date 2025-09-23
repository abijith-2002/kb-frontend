import React, { useCallback, useEffect, useMemo, useState } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatMessage, { ActionChip } from "../components/ChatMessage";
import Composer from "../components/Composer";
import supabase from "../lib/supabaseClient";

/**
 * PUBLIC_INTERFACE
 * Chat
 * Main chat interface page replicating the design in assets/chat_interface_design_notes.md and image reference.
 * Layout:
 *  - Left fixed sidebar (md+)
 *  - Right chat area with header, thread, and sticky composer
 *
 * Notes on backend integration:
 *  - This component includes stubs for sessions and sending messages. The actual API endpoints for messages are not
 *    defined in the provided openapi.json, so calls are mocked. Wire to your backend by replacing the stubs in
 *    fetchSessions and sendMessage with real fetch calls to process.env.REACT_APP_API_BASE.
 */
export default function Chat() {
  const [activeSessionId, setActiveSessionId] = useState("default");
  const [sessions, setSessions] = useState([{ id: "default", title: "KnowledgeBot" }]);
  const [messages, setMessages] = useState(() => seedMessages());
  const [meEmail, setMeEmail] = useState("");

  // Load current user email
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setMeEmail(data.session?.user?.email || "");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setMeEmail(sess?.user?.email || "");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Stub: fetch sessions from backend (replace with real call)
  const fetchSessions = useCallback(async () => {
    try {
      // Example (disabled): await fetch(`${process.env.REACT_APP_API_BASE}/sessions`, { headers: { Authorization: `Bearer ${token}` }})
      // For now, keep default single "KnowledgeBot"
      setSessions([{ id: "default", title: "KnowledgeBot" }]);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Stub: send message to backend; for demo we append locally and echo a canned assistant response
  const sendMessage = useCallback(async (text) => {
    const userMsg = { id: `${Date.now()}-u`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    // Simulate assistant response section with chips
    const assistantMsg = {
      id: `${Date.now()}-a`,
      role: "assistant",
      content: (
        <div className="flex flex-col gap-3">
          <h3 style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "16.5px" }}>
            • Increment 2: File Upload & Storage
          </h3>
          <p>
            <strong style={{ color: "var(--text-primary)" }}>Prompt:</strong>{" "}
            Please outline the steps to allow users to upload files (PDF, DOCX, TXT, XLSX) securely, store them, and
            persist metadata for retrieval in chat sessions.
          </p>
          <div>
            <ActionChip label="How to use?" onClick={() => {}} />
          </div>

          <h3 style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "16.5px" }}>
            • Increment 3: Text File Processing (DOCX, PDF, TXT)
          </h3>
          <p>
            <strong style={{ color: "var(--text-primary)" }}>Prompt:</strong>{" "}
            Describe how to extract text from documents, chunk content, and prepare it for embeddings while handling
            edge cases and document types.
          </p>
          <div>
            <ActionChip label="Explain more on increment 2" onClick={() => {}} />
          </div>
        </div>
      ),
    };

    // Mock delay
    setTimeout(() => {
      setMessages((prev) => [...prev, assistantMsg]);
    }, 400);
  }, []);

  const headerRight = useMemo(
    () => (
      <button
        className="inline-flex items-center justify-center"
        style={{
          height: "34px",
          padding: "0 14px",
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
        How to use?
      </button>
    ),
    []
  );

  return (
    <div
      className="w-full"
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        height: "100vh",
        background: "var(--bg-canvas)",
      }}
    >
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={() => setMessages(seedMessages())}
        onSelectSession={(id) => setActiveSessionId(id)}
      />

      <section className="h-[100vh] min-h-0" style={{ display: "grid", gridTemplateRows: "auto 1fr auto" }}>
        {/* Header */}
        <header
          className="flex items-center justify-between"
          style={{
            padding: "22px 24px 12px 24px",
            background: "transparent",
          }}
        >
          <h1
            style={{
              color: "var(--text-primary)",
              fontSize: "19px",
              fontWeight: 600,
              fontFamily: "\"Helvetica Neue\", Arial, sans-serif",
            }}
          >
            KnowledgeBot
          </h1>
          <div className="hidden sm:block">{headerRight}</div>
        </header>

        {/* Thread */}
        <div className="min-h-0 overflow-auto">
          <div
            className="mx-auto"
            style={{
              maxWidth: "1040px",
              padding: "0 24px 96px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {messages.map((m) => (
              <ChatMessage key={m.id} role={m.role} content={renderMessageContent(m)} />
            ))}
          </div>
        </div>

        {/* Composer */}
        <Composer onSend={sendMessage} />
      </section>
    </div>
  );
}

function renderMessageContent(m) {
  if (m.role === "assistant") {
    return m.content;
  }
  // User message style with subtle emoji/check feel
  return (
    <div className="flex items-start gap-2">
      <span role="img" aria-label="check" style={{ color: "var(--accent)" }}>
        ✅
      </span>
      <p style={{ color: "var(--text-primary)" }}>{m.content}</p>
    </div>
  );
}

function seedMessages() {
  return [
    {
      id: "a-1",
      role: "assistant",
      content: (
        <div className="flex flex-col gap-3">
          <h3 style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "16.5px" }}>
            • Increment 2: File Upload & Storage
          </h3>
          <p>
            <strong style={{ color: "var(--text-primary)" }}>Prompt:</strong>{" "}
            Implement secure upload for PDF, DOCX, TXT, XLSX. Store in Supabase Storage and persist metadata for
            retrieval.
          </p>
          <div>
            <ActionChip label="How to use?" onClick={() => {}} />
          </div>

          <h3 style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "16.5px" }}>
            • Increment 3: Text File Processing (DOCX, PDF, TXT)
          </h3>
          <p>
            <strong style={{ color: "var(--text-primary)" }}>Prompt:</strong>{" "}
            Extract text, chunk, and prepare embeddings. Ensure robust handling of different document types.
          </p>
          <div>
            <ActionChip label="Explain more on increment 2" onClick={() => {}} />
          </div>
        </div>
      ),
    },
    {
      id: "u-1",
      role: "user",
      content: "Got it — I’ll implement the chat interface and composer next.",
    },
  ];
}

import { useEffect, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * ChatView
 * Scrollable chat message area.
 * Props:
 *  - session: object | null
 *  - messages: Array<MessageObject>
 *  - loading: boolean
 *  - error: string | null
 *  - emptyHint: string
 */
export default function ChatView({ session, messages, loading, error, emptyHint }) {
  const scrollerRef = useRef(null);

  useEffect(() => {
    // auto scroll to bottom on new messages
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div ref={scrollerRef} className="h-full overflow-y-auto px-4 py-4">
      {!session ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-app-onbg-muted text-sm">{emptyHint}</div>
        </div>
      ) : loading ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-app-onbg-muted text-sm">Loading conversation...</div>
        </div>
      ) : error ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      ) : messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-app-onbg-muted text-sm">{emptyHint}</div>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl mx-auto w-full">
          {messages.map((m) => (
            <MessageBubble key={m.id} role={m.role} content={m.content} createdAt={m.created_at} />
          ))}
        </div>
      )}
    </div>
  );
}

function MessageBubble({ role, content, createdAt }) {
  const isUser = role === "user";
  const isAssistant = role === "assistant";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-2xl px-4 py-3 max-w-[80%] border ${
          isUser
            ? "bg-app-accent text-app-onaccent border-transparent"
            : "bg-app-surface text-app-onbg border-app-border"
        }`}
      >
        <div className="whitespace-pre-wrap text-sm">{content}</div>
        {createdAt ? (
          <div className={`text-[10px] mt-1 ${isUser ? "opacity-80" : "text-app-onbg-muted"}`}>
            {new Date(createdAt).toLocaleString()}
          </div>
        ) : null}
      </div>
    </div>
  );
}

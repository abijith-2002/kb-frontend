import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import api from "../lib/apiClient";
import SessionSidebar from "../components/chat/SessionSidebar";
import ChatView from "../components/chat/ChatView";
import MessageInput from "../components/chat/MessageInput";

/**
 * PUBLIC_INTERFACE
 * Chat
 * Main chat page that renders:
 *  - Left sidebar with session list and "New Chat"
 *  - ChatView showing message history (placeholder for now; backend list not yet implemented)
 *  - MessageInput with text and file upload bound to the active session
 *
 * Routing:
 *  - /chat                     -> selects first session if any; otherwise prompts user to create one
 *  - /chat/:sessionId          -> loads that session; if not found or unauthorized, shows an error placeholder
 *
 * Query param compatibility:
 *  - /chat?session=<id> is supported and will navigate to /chat/<id>
 */
export default function Chat() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  // session ID from path or ?session=
  const sessionIdFromQuery = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get("session") || null;
  }, [location.search]);

  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sessionsErr, setSessionsErr] = useState("");

  const [activeSessionId, setActiveSessionId] = useState(
    params.sessionId || sessionIdFromQuery || ""
  );
  const [creating, setCreating] = useState(false);

  // Simple in-memory message view state; actual list endpoint isn't in spec yet
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState("");

  // normalize route on initial mount if query contains session
  useEffect(() => {
    if (sessionIdFromQuery) {
      navigate(`/chat/${encodeURIComponent(sessionIdFromQuery)}`, { replace: true });
    }
  }, [sessionIdFromQuery, navigate]);

  // keep activeSessionId in sync with route param
  useEffect(() => {
    if (params.sessionId && params.sessionId !== activeSessionId) {
      setActiveSessionId(params.sessionId);
      // reset messages placeholder for newly selected session
      setMessages([]);
    }
  }, [params.sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSessions = useCallback(async () => {
    setSessionsErr("");
    setLoadingSessions(true);
    try {
      const data = await api.sessions.list(); // { items: [...] }
      const list = Array.isArray(data?.items) ? data.items : [];
      setSessions(list);
      // If on /chat with no session id, pick the first one if present
      if (!params.sessionId && list.length > 0) {
        navigate(`/chat/${encodeURIComponent(list[0].id)}`, { replace: true });
      }
    } catch (e) {
      setSessionsErr(e?.message || "Failed to load sessions.");
    } finally {
      setLoadingSessions(false);
    }
  }, [navigate, params.sessionId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const onCreateSession = useCallback(async () => {
    setCreating(true);
    try {
      const created = await api.sessions.create({});
      // append to state
      setSessions((prev) => [created, ...prev]);
      setActiveSessionId(created.id);
      navigate(`/chat/${encodeURIComponent(created.id)}`);
      // messages reset for new session
      setMessages([]);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e?.message || "Failed to create session.");
    } finally {
      setCreating(false);
    }
  }, [navigate]);

  const onSelectSession = useCallback(
    (id) => {
      if (!id) return;
      setActiveSessionId(id);
      navigate(`/chat/${encodeURIComponent(id)}`);
      // reset msg placeholder when switching
      setMessages([]);
    },
    [navigate]
  );

  // Simulated message fetch placeholder (no GET messages endpoint in spec)
  // You can populate with stub items upon session change
  useEffect(() => {
    let cancelled = false;
    async function loadMessagesPlaceholder() {
      if (!activeSessionId) return;
      // Placeholder: maybe fetch last posted messages kept locally in this session
      // For now, keep as-is; on first select, show an empty state.
      if (!cancelled) {
        // no-op
      }
    }
    loadMessagesPlaceholder();
    return () => {
      cancelled = true;
    };
  }, [activeSessionId]);

  const handleSend = useCallback(
    async ({ text, pinnedFileIds }) => {
      if (!activeSessionId) return;
      setSendErr("");
      setSending(true);
      try {
        const resp = await api.sessions.postMessage(activeSessionId, {
          content: text,
          ...(Array.isArray(pinnedFileIds) && pinnedFileIds.length > 0
            ? { pinned_file_ids: pinnedFileIds }
            : {}),
        });
        const createdItems = Array.isArray(resp?.items) ? resp.items : [];
        // Append newly created messages to our local list
        setMessages((prev) => [...prev, ...createdItems]);
      } catch (e) {
        setSendErr(e?.message || "Failed to send message.");
      } finally {
        setSending(false);
      }
    },
    [activeSessionId]
  );

  // Upload handler bound to session
  const handleUpload = useCallback(
    async (file) => {
      if (!file) return;
      try {
        if (!activeSessionId) {
          // If no session yet, create one on-demand then upload
          const created = await api.sessions.create({});
          setSessions((prev) => [created, ...prev]);
          setActiveSessionId(created.id);
          navigate(`/chat/${encodeURIComponent(created.id)}`);
          await api.files.upload(file, { sessionId: created.id });
        } else {
          await api.files.upload(file, { sessionId: activeSessionId });
        }
        // Could refresh a "pinned files" list here with sessionsApi.listFiles(activeSessionId)
      } catch (e) {
        // eslint-disable-next-line no-alert
        alert(e?.message || "Failed to upload file.");
      }
    },
    [activeSessionId, navigate]
  );

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) || null,
    [sessions, activeSessionId]
  );

  return (
    <ProtectedRoute>
      <div className="h-[calc(100vh-56px)] md:h-[calc(100vh-60px)] w-full flex overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-app-border bg-app-surfaceAlt">
          <SessionSidebar
            sessions={sessions}
            loading={loadingSessions}
            error={sessionsErr}
            activeSessionId={activeSessionId}
            onCreateSession={onCreateSession}
            creating={creating}
            onSelectSession={onSelectSession}
          />
        </aside>

        {/* Main content area */}
        <section className="flex-1 flex flex-col min-w-0">
          {/* Mobile top bar with session switcher/new chat */}
          <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-app-border bg-app-surfaceAlt">
            <div className="text-sm text-app-onbg-muted truncate">
              {activeSession?.title || "Chat"}
            </div>
            <button className="btn btn-sm px-3 py-1.5" onClick={onCreateSession} disabled={creating}>
              {creating ? "Creating..." : "New Chat"}
            </button>
          </div>

          {/* Chat view (messages) */}
          <div className="flex-1 min-h-0">
            <ChatView
              session={activeSession}
              messages={messages}
              loading={false}
              error={null}
              emptyHint={
                activeSessionId
                  ? "Ask a question about your uploaded documents to get started."
                  : "Create a new chat to begin."
              }
            />
          </div>

          {/* Message input */}
          <div className="border-t border-app-border bg-app-surfaceAlt px-3 py-2">
            <MessageInput
              disabled={!activeSessionId}
              sending={sending}
              error={sendErr}
              onSend={handleSend}
              onUpload={handleUpload}
            />
            {!activeSessionId ? (
              <div className="mt-2 text-xs text-app-onbg-muted">
                No session yet. Click{" "}
                <button className="small-link underline" onClick={onCreateSession} disabled={creating}>
                  {creating ? "Creating..." : "New Chat"}
                </button>{" "}
                to start.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

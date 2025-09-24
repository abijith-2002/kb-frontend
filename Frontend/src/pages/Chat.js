import React, { useMemo, useState } from "react";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import Thread from "../components/chat/Thread";
import Composer from "../components/chat/Composer";
import useChatApi from "../hooks/useChatApi";

/**
 * PUBLIC_INTERFACE
 * Chat
 * Main chat page layout composed of Sidebar, ChatHeader, Thread area, and Composer.
 * Wires real API calls for sessions, file uploads, and messages.
 */
export default function Chat() {
  const [value, setValue] = useState("");
  const {
    sessions,
    activeSessionId,
    files,
    messages,
    loadingSessions,
    uploading,
    uploadProgress,
    uploadErrors,
    sending,
    canSend,
    sessionError,
    sendError,
    createSession,
    switchSession,
    uploadFiles,
    deleteFile,
    sendMessage,
  } = useChatApi();

  const onCreate = async () => {
    await createSession("New chat");
  };

  const onSelect = (id) => switchSession(id);

  const handleUpload = async (fileList) => {
    try {
      await uploadFiles(fileList);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Upload error", e);
    }
  };

  const handleSend = async () => {
    const text = value.trim();
    if (!text) return;
    try {
      await sendMessage(text);
      setValue("");
    } catch (e) {
      // error already reflected in sendError
    }
  };

  const disableComposer = useMemo(() => sending || uploading, [sending, uploading]);

  return (
    <div
      className="bg-canvas"
      style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        height: "calc(100vh - 56px)", // account for existing NavBar height area
      }}
    >
      <Sidebar sessions={sessions} activeId={activeSessionId} onCreate={onCreate} onSelect={onSelect} />
      <section
        className="relative"
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          height: "100%",
        }}
        aria-label="Main chat area"
      >
        <ChatHeader />
        <Thread>
          {/* Loading / error states */}
          {loadingSessions && (
            <div className="text-tertiary text-sm" style={{ padding: 8 }}>
              Loading sessions...
            </div>
          )}
          {sessionError && (
            <div className="text-red-400/90 text-sm" role="alert" style={{ padding: 8 }}>
              {sessionError}
            </div>
          )}

          {/* Files status (simple list and progress) */}
          {uploading && (
            <div className="text-tertiary text-xs" style={{ padding: 8 }}>
              Uploading files...
            </div>
          )}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="text-tertiary text-xs" style={{ padding: 8 }}>
              {Object.entries(uploadProgress).map(([name, pct]) => (
                <div key={name} className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                  <span className="truncate max-w-[60%]">{name}</span>
                  <span>{pct}%</span>
                </div>
              ))}
            </div>
          )}
          {Object.keys(uploadErrors).length > 0 && (
            <div className="text-red-400/90 text-xs" role="alert" style={{ padding: 8 }}>
              {Object.entries(uploadErrors).map(([name, msg]) => (
                <div key={name}>
                  {name}: {msg}
                </div>
              ))}
            </div>
          )}

          {/* Files list with simple remove actions */}
          {files?.length > 0 && (
            <div className="text-secondary text-xs" style={{ padding: 8 }}>
              <div className="text-tertiary uppercase tracking-wider text-[11px]" style={{ marginBottom: 6 }}>
                Attached files
              </div>
              <div className="flex flex-col gap-1">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between round-10 border-subtle"
                    style={{ padding: "6px 10px" }}
                  >
                    <span className="truncate">{f.name}</span>
                    <button
                      className="btn-ghost round-10"
                      style={{ height: 28, padding: "0 10px" }}
                      onClick={() => deleteFile(f.id)}
                      title="Remove file"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <article
                key={m.id}
                className={m.role === "assistant" ? "bg-panel border-subtle round-14" : ""}
                style={{
                  padding: m.role === "assistant" ? 16 : 0,
                }}
              >
                <div
                  className={m.role === "assistant" ? "text-secondary" : "text-primary"}
                  style={{ fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap" }}
                >
                  {m.content}
                </div>
              </article>
            ))}
          </div>

          {/* Send error */}
          {sendError && (
            <div className="text-red-400/90 text-xs" role="alert" style={{ padding: 8 }}>
              {sendError}
            </div>
          )}

          {/* Info: require file before send */}
          {!canSend && files.length === 0 && (
            <div className="text-tertiary text-xs" style={{ padding: 8 }}>
              Upload at least one file to enable sending messages.
            </div>
          )}
        </Thread>
        <Composer
          value={value}
          onChange={setValue}
          onSend={handleSend}
          onUpload={handleUpload}
          isSending={sending}
          disabled={disableComposer || !canSend}
        />
      </section>
    </div>
  );
}

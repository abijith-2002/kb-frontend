import { useCallback, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * MessageInput
 * Input bar for composing a message and optionally uploading a file.
 * Props:
 *  - disabled: boolean
 *  - sending: boolean
 *  - error: string
 *  - onSend: ({ text: string, pinnedFileIds?: string[] }) => Promise<void>
 *  - onUpload: (file: File) => Promise<void>
 */
export default function MessageInput({ disabled, sending, error, onSend, onUpload }) {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);

  const triggerFile = () => {
    fileRef.current?.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErr("");
    setUploading(true);
    setProgress(10); // fake progress indication
    try {
      await onUpload(file);
      setProgress(100);
      setTimeout(() => setProgress(0), 600);
    } catch (e2) {
      setUploadErr(e2?.message || "Upload failed.");
      setProgress(0);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const doSend = useCallback(async () => {
    if (!text.trim() || disabled || sending) return;
    await onSend({ text: text.trim() });
    setText("");
  }, [text, disabled, sending, onSend]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void doSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {error ? <div className="text-xs text-red-400 mb-1">{error}</div> : null}
      {uploadErr ? <div className="text-xs text-red-400 mb-1">{uploadErr}</div> : null}

      <div className="flex items-end gap-2">
        <button
          type="button"
          className="btn-secondary px-3 py-2"
          onClick={triggerFile}
          disabled={disabled || uploading || sending}
        >
          {uploading ? "Uploading..." : "Attach"}
        </button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt,.xlsx"
          onChange={handleFile}
        />
        <div className="flex-1">
          <textarea
            className="input resize-none"
            rows={2}
            placeholder={disabled ? "Create a chat to start messaging..." : "Ask a question..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={disabled || sending}
          />
          {uploading ? (
            <div className="mt-1 h-1 w-full bg-app-surface rounded overflow-hidden">
              <div
                className="h-1 bg-app-accent transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className="btn px-4 py-2"
          onClick={doSend}
          disabled={disabled || sending || !text.trim()}
          aria-busy={sending}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="mt-1 text-[10px] text-app-onbg-muted">
        Press Enter to send, Shift+Enter for a new line.
      </div>
    </div>
  );
}

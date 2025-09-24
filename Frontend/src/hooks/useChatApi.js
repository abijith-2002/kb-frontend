 /**
  * PUBLIC_INTERFACE
  * useChatApi
  * React hook that wires the chat UI to the backend API:
  *  - Loads sessions and selects the first one (or creates one on demand)
  *  - Lists files for the active session
  *  - Uploads files with progress and error state
  *  - Sends user messages and appends assistant stub responses
  *
  * Note: Increment 2 backend doesn't expose a "list messages" endpoint; we keep
  *       messages state locally for the current runtime session.
  */
 import { useCallback, useEffect, useMemo, useRef, useState } from "react";
 import supabase from "../lib/supabaseClient";
 import { createApiClient } from "../lib/apiClient";
 
 const api = createApiClient(() => supabase.auth.getSession());
 
 export default function useChatApi() {
   const [sessions, setSessions] = useState([]); // [{id,title,...}]
   const [activeSessionId, setActiveSessionId] = useState(null);
   const [loadingSessions, setLoadingSessions] = useState(false);
   const [sessionError, setSessionError] = useState("");
 
   const [files, setFiles] = useState([]); // FileMeta[]
   const [uploading, setUploading] = useState(false);
   const [uploadProgress, setUploadProgress] = useState({}); // fileName -> pct
   const [uploadErrors, setUploadErrors] = useState({}); // fileName -> error message
 
   const [messages, setMessages] = useState([]); // {id, role, content, timestamp}
   const [sending, setSending] = useState(false);
   const [sendError, setSendError] = useState("");
 
   const mountedRef = useRef(true);
   useEffect(() => {
     return () => {
       mountedRef.current = false;
     };
   }, []);
 
   // Load sessions on mount (and when auth changes)
   const loadSessions = useCallback(async () => {
     setLoadingSessions(true);
     setSessionError("");
     try {
       const res = await api.sessions.list();
       const items = res?.items || [];
       if (!mountedRef.current) return;
       setSessions(items);
       if (!activeSessionId && items.length > 0) {
         setActiveSessionId(items[0].id);
       }
     } catch (e) {
       if (!mountedRef.current) return;
       setSessionError(e.message || "Failed to load sessions");
     } finally {
       if (mountedRef.current) setLoadingSessions(false);
     }
   }, [activeSessionId]);
 
   // When active session changes, load files
   const loadFiles = useCallback(async (sessionId) => {
     if (!sessionId) {
       setFiles([]);
       return;
     }
     try {
       const res = await api.files.list(sessionId);
       const items = res?.items || [];
       if (!mountedRef.current) return;
       setFiles(items);
     } catch (e) {
       // eslint-disable-next-line no-console
       console.error("Failed to load files", e);
     }
   }, []);
 
   useEffect(() => {
     loadSessions();
   }, [loadSessions]);
 
   useEffect(() => {
     if (activeSessionId) loadFiles(activeSessionId);
   }, [activeSessionId, loadFiles]);
 
   const createSession = useCallback(async (title = null) => {
     try {
       const s = await api.sessions.create(title);
       // Refresh list and activate the new session
       await loadSessions();
       if (s?.id) setActiveSessionId(s.id);
       // Reset local state tied to session
       setMessages([]);
       setFiles([]);
       return s;
     } catch (e) {
       setSessionError(e.message || "Failed to create session");
       throw e;
     }
   }, [loadSessions]);
 
   const switchSession = useCallback((sessionId) => {
     setActiveSessionId(sessionId);
     // Reset local messages when switching (no messages list endpoint in Increment 2)
     setMessages([]);
   }, []);
 
   const deleteFile = useCallback(
     async (fileId) => {
       await api.files.remove(fileId);
       // Refresh files
       if (activeSessionId) await loadFiles(activeSessionId);
     },
     [activeSessionId, loadFiles]
   );
 
   const uploadFiles = useCallback(
     async (fileList) => {
       if (!activeSessionId) {
         // auto-create a session if none exists
         const s = await createSession("New chat");
         if (s?.id) setActiveSessionId(s.id);
       }
       const sessionId = activeSessionId || (await api.sessions.list())?.items?.[0]?.id;
 
       setUploading(true);
       const localProgress = {};
       const localErrors = {};
 
       for (const file of fileList) {
         try {
           setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
           // Upload with progress
           await api.files.upload({
             sessionId,
             file,
             onProgress: (pct) => {
               localProgress[file.name] = pct;
               if (mountedRef.current) {
                 setUploadProgress((prev) => ({ ...prev, [file.name]: pct }));
               }
             },
           });
           // After each success, refresh files
           await loadFiles(sessionId);
         } catch (e) {
           // capture error for this file
           localErrors[file.name] = e.message || "Upload failed";
           if (mountedRef.current) {
             setUploadErrors((prev) => ({ ...prev, [file.name]: localErrors[file.name] }));
           }
         }
       }
       if (mountedRef.current) {
         setUploading(false);
       }
       return { progress: localProgress, errors: localErrors };
     },
     [activeSessionId, createSession, loadFiles]
   );
 
   const canSend = useMemo(() => {
     // Business rule per increment2_action_items: require at least one file in active session
     return files && files.length > 0 && !sending;
   }, [files, sending]);
 
   const sendMessage = useCallback(
     async (content) => {
       if (!activeSessionId) {
         await createSession("New chat");
       }
       if (!canSend) {
         const err = "Please upload at least one file before sending a message.";
         setSendError(err);
         throw new Error(err);
       }
       setSending(true);
       setSendError("");
       try {
         const sessionId = activeSessionId;
 
         // Append user message locally
         const userMsg = {
           id: `user-${Date.now()}`,
           role: "user",
           content,
           timestamp: new Date().toISOString(),
         };
         setMessages((prev) => [...prev, userMsg]);
 
         // Call backend; returns assistant stub
         const assistant = await api.messages.create(sessionId, { role: "user", content });
         if (assistant) {
           setMessages((prev) => [...prev, assistant]);
         }
       } catch (e) {
         setSendError(e.message || "Failed to send message");
         throw e;
       } finally {
         if (mountedRef.current) setSending(false);
       }
     },
     [activeSessionId, canSend, createSession]
   );
 
   return {
     // data
     sessions,
     activeSessionId,
     files,
     messages,
 
     // flags/errors
     loadingSessions,
     uploading,
     uploadProgress,
     uploadErrors,
     sending,
     canSend,
     sessionError,
     sendError,
 
     // actions
     createSession,
     switchSession,
     loadSessions,
     loadFiles,
     uploadFiles,
     deleteFile,
     sendMessage,
   };
 }

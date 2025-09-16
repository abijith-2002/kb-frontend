 /**
  * PUBLIC_INTERFACE
  * apiClient
  * A minimal API client for the KnowledgeBot frontend that communicates with the FastAPI backend.
  *
  * Features:
  * - Reads API base URL from REACT_APP_API_BASE (no hardcoding).
  * - Attaches Supabase access token as Authorization: Bearer <token> for authenticated requests.
  * - Centralized error handling, throwing informative errors with response body where available.
  * - Handles JSON requests and multipart/form-data uploads.
  * - Provides wrappers for sessions, files, and messages to match backend openapi.json.
  *
  * Environment variables required:
  * - REACT_APP_API_BASE
  */
 import supabase from "./supabaseClient";
 
 const API_BASE = process.env.REACT_APP_API_BASE;
 if (!API_BASE) {
   // eslint-disable-next-line no-console
   console.warn(
     "[apiClient] REACT_APP_API_BASE is not set. API calls will fail until configured."
   );
 }
 
 /**
  * Fetch the current Supabase JWT access token from the active session.
  * Returns null if no session is present.
  */
 async function getAccessToken() {
   const { data, error } = await supabase.auth.getSession();
   if (error) {
     // eslint-disable-next-line no-console
     console.error("[apiClient] Failed to get Supabase session:", error);
     return null;
   }
   return data?.session?.access_token || null;
 }
 
 /**
  * Build headers for JSON requests, merging any overrides.
  * Adds Authorization and Content-Type when appropriate.
  */
 async function buildJsonHeaders(overrides = {}) {
   const token = await getAccessToken();
   const base = {
     ...(token ? { Authorization: `Bearer ${token}` } : {}),
     "Content-Type": "application/json",
   };
   return { ...base, ...overrides };
 }
 
 /**
  * Build headers for multipart/form-data (do not set Content-Type explicitly;
  * the browser will set proper boundary automatically).
  */
 async function buildMultipartHeaders(overrides = {}) {
   const token = await getAccessToken();
   const base = {
     ...(token ? { Authorization: `Bearer ${token}` } : {}),
   };
   return { ...base, ...overrides };
 }
 
 /**
  * Centralized fetch wrapper that handles:
  * - base URL concatenation
  * - JSON parsing
  * - error extraction and throwing
  */
 async function request(path, { method = "GET", headers = {}, body = undefined, json = true } = {}) {
   if (!API_BASE) {
     throw new Error("API base URL not set (REACT_APP_API_BASE).");
   }
   const url = `${API_BASE}${path}`;
 
   const resp = await fetch(url, { method, headers, body });
 
   const contentType = resp.headers.get("content-type") || "";
   const isJson = contentType.includes("application/json");
 
   if (!resp.ok) {
     let message = `Request failed with ${resp.status}`;
     if (isJson) {
       try {
         const data = await resp.json();
         const detail = data?.detail || data?.message || JSON.stringify(data);
         message = `${message}: ${detail}`;
       } catch {
         // ignore parse error, keep default message
       }
     } else {
       try {
         const text = await resp.text();
         if (text) message = `${message}: ${text}`;
       } catch {
         // ignore
       }
     }
     const err = new Error(message);
     err.status = resp.status;
     throw err;
   }
 
   if (json && isJson) {
     return resp.json();
   }
   if (!json) {
     return resp; // caller handles body
   }
   // if json requested but response is not json, just return text
   return resp.text();
 }
 
 // PUBLIC_INTERFACE
 export const sessionsApi = {
   /**
    * List sessions for current user.
    * GET /sessions
    */
   async list() {
     const headers = await buildJsonHeaders();
     return request("/sessions", { method: "GET", headers });
   },
 
   /**
    * Create a new session.
    * POST /sessions
    * payload: { title?: string | null }
    */
   async create(payload = {}) {
     const headers = await buildJsonHeaders();
     return request("/sessions", {
       method: "POST",
       headers,
       body: JSON.stringify(payload ?? {}),
     });
   },
 
   /**
    * Get a session by ID.
    * GET /sessions/{session_id}
    */
   async get(sessionId) {
     if (!sessionId) throw new Error("sessionId is required");
     const headers = await buildJsonHeaders();
     return request(`/sessions/${encodeURIComponent(sessionId)}`, {
       method: "GET",
       headers,
     });
   },
 
   /**
    * Update a session by ID.
    * PATCH /sessions/{session_id}
    * payload: { title?: string | null }
    */
   async update(sessionId, payload = {}) {
     if (!sessionId) throw new Error("sessionId is required");
     const headers = await buildJsonHeaders();
     return request(`/sessions/${encodeURIComponent(sessionId)}`, {
       method: "PATCH",
       headers,
       body: JSON.stringify(payload ?? {}),
     });
   },
 
   /**
    * Delete a session by ID.
    * DELETE /sessions/{session_id}
    */
   async remove(sessionId) {
     if (!sessionId) throw new Error("sessionId is required");
     const headers = await buildJsonHeaders();
     // Some APIs return 204 No Content
     const resp = await request(`/sessions/${encodeURIComponent(sessionId)}`, {
       method: "DELETE",
       headers,
       json: false,
     });
     // Try to parse json if present, else return empty object
     try {
       return await resp.json();
     } catch {
       return {};
     }
   },
 
   /**
    * List files for a session.
    * GET /sessions/{session_id}/files
    */
   async listFiles(sessionId) {
     if (!sessionId) throw new Error("sessionId is required");
     const headers = await buildJsonHeaders();
     return request(`/sessions/${encodeURIComponent(sessionId)}/files`, {
       method: "GET",
       headers,
     });
   },
 
   /**
    * Unpin a file from a session.
    * DELETE /sessions/{session_id}/files?file_id=...
    */
   async unpinFile(sessionId, fileId) {
     if (!sessionId) throw new Error("sessionId is required");
     if (!fileId) throw new Error("fileId is required");
     const headers = await buildJsonHeaders();
     return request(
       `/sessions/${encodeURIComponent(sessionId)}/files?file_id=${encodeURIComponent(fileId)}`,
       { method: "DELETE", headers }
     );
   },
 
   /**
    * Post message to a session.
    * POST /sessions/{session_id}/message
    * payload: { content: string, pinned_file_ids?: string[] }
    */
   async postMessage(sessionId, payload) {
     if (!sessionId) throw new Error("sessionId is required");
     if (!payload || !payload.content) throw new Error("payload.content is required");
     const headers = await buildJsonHeaders();
     return request(`/sessions/${encodeURIComponent(sessionId)}/message`, {
       method: "POST",
       headers,
       body: JSON.stringify(payload),
     });
   },
 };
 
 // PUBLIC_INTERFACE
 export const filesApi = {
   /**
    * List files for the current user, optionally by session.
    * GET /files?session_id=<id|null>
    */
   async list(sessionId = undefined) {
     const headers = await buildJsonHeaders();
     const qs = sessionId != null ? `?session_id=${encodeURIComponent(sessionId)}` : "";
     return request(`/files${qs}`, { method: "GET", headers });
   },
 
   /**
    * Upload file (multipart/form-data).
    * POST /files
    * fields:
    *  - file (File)
    *  - optional: session_id (string)
    */
   async upload(file, { sessionId } = {}) {
     if (!file) throw new Error("file is required");
     const form = new FormData();
     form.append("file", file);
     if (sessionId) form.append("session_id", sessionId);
 
     const headers = await buildMultipartHeaders();
     // Do not set Content-Type for FormData; browser handles it with boundaries.
     return request("/files", {
       method: "POST",
       headers,
       body: form,
     });
   },
 
   /**
    * Delete a file by ID.
    * DELETE /files/{file_id}
    */
   async remove(fileId) {
     if (!fileId) throw new Error("fileId is required");
     const headers = await buildJsonHeaders();
     return request(`/files/${encodeURIComponent(fileId)}`, {
       method: "DELETE",
       headers,
     });
   },
 };
 
 /**
  * PUBLIC_INTERFACE
  * messagesApi
  * Only session-scoped POST is present in backend spec; we expose a helper here for future extension.
  * For listing messages, use your page-specific API path when backend adds it (not in current spec).
  */
 export const messagesApi = {
   /**
    * Post a message to a session. Alias of sessionsApi.postMessage.
    */
   async post(sessionId, payload) {
     return sessionsApi.postMessage(sessionId, payload);
   },
 };
 
 /**
  * PUBLIC_INTERFACE
  * api
  * Aggregated export for convenience.
  */
 const api = {
   sessions: sessionsApi,
   files: filesApi,
   messages: messagesApi,
 };
 
 export default api;

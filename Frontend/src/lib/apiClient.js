 /**
  * PUBLIC_INTERFACE
  * createApiClient
  * A lightweight API client for the FastAPI backend. It injects the Supabase JWT
  * as a Bearer token for all requests and exposes convenience methods for
  * sessions, files, and messages according to Increment 2 OpenAPI.
  *
  * Environment:
  *  - REACT_APP_API_BASE: Base URL of the backend (e.g., https://api.example.com)
  *
  * Usage:
  *  import { createApiClient } from './apiClient';
  *  const api = createApiClient(() => supabase.auth.getSession());
  *  const sessions = await api.sessions.list();
  */
 import { getSupabaseClient } from "./supabaseClient";
 
 const API_BASE = process.env.REACT_APP_API_BASE;
 
 if (!API_BASE) {
   // eslint-disable-next-line no-console
   console.warn(
     "[API] REACT_APP_API_BASE not set. Set it in your environment to enable backend calls."
   );
 }
 
 /**
  * Fetch wrapper that automatically adds Authorization: Bearer <jwt>.
  * Handles JSON and multipart requests.
  *
  * IMPORTANT: Read the Response body only once. We parse body into a single string,
  * try JSON.parse on it, and use that single parsed value to avoid "body stream already read".
  */
 async function authedFetch(getSessionFn, path, options = {}) {
   const base = API_BASE || "";
   const url = `${base}${path}`;
 
   // Get Supabase session for access token
   const sessRes = await getSessionFn();
   const accessToken = sessRes?.data?.session?.access_token;
   const headers = new Headers(options.headers || {});
   if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
 
   const resp = await fetch(url, { ...options, headers });
 
   // Read body exactly once (as text), then attempt JSON parse.
   const rawText = await resp.text();
   let parsed;
   let isJson = false;
   try {
     parsed = rawText ? JSON.parse(rawText) : null;
     isJson = true;
   } catch (_e) {
     parsed = rawText;
   }
 
   if (!resp.ok) {
     const detail =
       (isJson && (parsed?.detail || parsed?.message || JSON.stringify(parsed))) ||
       (rawText || `${resp.status} ${resp.statusText}`);
     const err = new Error(
       `[API] ${options.method || "GET"} ${path} failed: ${resp.status} ${resp.statusText} :: ${detail}`
     );
     err.status = resp.status;
     err.body = detail;
     throw err;
   }
 
   // Success: return parsed JSON if available, else text
   return isJson ? parsed : rawText;
 }
 
 /**
  * PUBLIC_INTERFACE
  * createApiClient
  * Returns a small client with grouped endpoints. Provide a function that returns
  * supabase.auth.getSession() promise so we can always get the freshest token.
  */
 export function createApiClient(getSessionFn = () => getSupabaseClient().auth.getSession()) {
   return {
     // Sessions
     sessions: {
       /** List user's sessions */
       async list() {
         return authedFetch(getSessionFn, `/sessions`, { method: "GET" });
       },
       /** Create a session with optional title */
       async create(title = null) {
         const body = title ? { title } : {};
         return authedFetch(getSessionFn, `/sessions`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(body),
         });
       },
       /** Get a specific session */
       async get(sessionId) {
         return authedFetch(getSessionFn, `/sessions/${encodeURIComponent(sessionId)}`, {
           method: "GET",
         });
       },
       /** Update a session (e.g., title) */
       async update(sessionId, payload) {
         return authedFetch(getSessionFn, `/sessions/${encodeURIComponent(sessionId)}`, {
           method: "PATCH",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(payload || {}),
         });
       },
       /** Delete a session */
       async remove(sessionId) {
         return authedFetch(getSessionFn, `/sessions/${encodeURIComponent(sessionId)}`, {
           method: "DELETE",
         });
       },
     },
 
     // Files
     files: {
       /** List files, optionally filtered by session_id */
       async list(sessionId = null) {
         const qs = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "";
         return authedFetch(getSessionFn, `/files${qs}`, { method: "GET" });
       },
       /** Upload a file (multipart/form-data), returns FileMeta */
       async upload({ sessionId, file, onProgress }) {
         const base = API_BASE || "";
         const url = `${base}/files`;
 
         const sessRes = await getSessionFn();
         const accessToken = sessRes?.data?.session?.access_token;
 
         const form = new FormData();
         form.append("session_id", sessionId);
         form.append("file", file);
 
         // Use XHR to report upload progress (fetch doesn't support progress yet).
         const xhr = new XMLHttpRequest();
         const promise = new Promise((resolve, reject) => {
           xhr.open("POST", url, true);
           if (accessToken) xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
 
           xhr.upload.onprogress = (evt) => {
             if (evt.lengthComputable && typeof onProgress === "function") {
               const pct = Math.round((evt.loaded / evt.total) * 100);
               onProgress(pct);
             }
           };
           xhr.onload = () => {
             if (xhr.status >= 200 && xhr.status < 300) {
               try {
                 const data = JSON.parse(xhr.responseText);
                 resolve(data);
               } catch (e) {
                 resolve(xhr.responseText);
               }
             } else {
               reject(
                 new Error(`[API] POST /files failed: ${xhr.status} ${xhr.statusText} :: ${xhr.responseText}`)
               );
             }
           };
           xhr.onerror = () => reject(new Error("[API] Network error while uploading file"));
           xhr.send(form);
         });
 
         return promise;
       },
       /** Delete a file by id (OpenAPI shows /files/{file_id}) */
       async remove(fileId) {
         return authedFetch(getSessionFn, `/files/${encodeURIComponent(fileId)}`, {
           method: "DELETE",
         });
       },
     },
 
     // Messages
     messages: {
       /** Post user message to a session, returns assistant stub response */
       async create(sessionId, { role = "user", content }) {
         return authedFetch(
           getSessionFn,
           `/sessions/${encodeURIComponent(sessionId)}/messages`,
           {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ role, content }),
           }
         );
       },
     },
   };
 }
 
 export default createApiClient;

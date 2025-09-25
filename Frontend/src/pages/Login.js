 /** 
  * PUBLIC_INTERFACE
  * Login
  * Login page that authenticates the user via Supabase Auth using email/password.
  * On success, user is redirected to /dashboard. Uses Tailwind for styling.
  */
 import { useState, useEffect } from "react";
 import { Link, useNavigate } from "react-router-dom";
 import supabase from "../lib/supabaseClient";
 import { authLogin } from "../lib/apiClient";
 
 export default function Login() {
   const navigate = useNavigate();
   const [form, setForm] = useState({ email: "", password: "" });
   const [loading, setLoading] = useState(false);
   const [err, setErr] = useState("");
 
   useEffect(() => {
     // If already authenticated, go to dashboard
     supabase.auth.getSession().then(({ data }) => {
       if (data.session) navigate("/dashboard", { replace: true });
     });
   }, [navigate]);
 
   const onChange = (e) => {
     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
   };
 
   const onSubmit = async (e) => {
     e.preventDefault();
     setErr("");
     setLoading(true);
     try {
       // 1) Log in via backend
       const tokenResp = await authLogin({
         email: form.email,
         password: form.password,
       });
       // tokenResp: { access_token, token_type }
       if (!tokenResp?.access_token) {
         throw new Error("No access token returned by backend.");
       }
       // 2) Set Supabase session using the returned JWT access token
       const { data: sessData, error: sessErr } = await supabase.auth.setSession({
         access_token: tokenResp.access_token,
         refresh_token: tokenResp.access_token, // backend may not return refresh token; set both for compatibility
       });
       if (sessErr) {
         throw sessErr;
       }
       if (!sessData?.session) {
         // If setSession didn't yield a session, fall back to fetching user
         const { data: userData, error: userErr } = await supabase.auth.getUser();
         if (userErr || !userData?.user) {
           throw new Error("Failed to establish authenticated session.");
         }
       }
       navigate("/dashboard", { replace: true });
     } catch (e2) {
       setErr(e2.message || "Failed to log in.");
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <section className="min-h-[92vh] flex items-center justify-center px-4 py-6 overflow-hidden">
       <div className="w-full max-w-sm">
         <div className="card p-6">
           <div className="mb-5 text-center">
             <h1 className="auth-title text-xl">KnowledgeBot</h1>
             <p className="auth-subtle mt-1 text-xs">Sign in to continue</p>
           </div>
 
           {err && (
             <div className="mb-3 text-red-400/90 text-xs" role="alert" aria-live="polite">
               {err}
             </div>
           )}
 
           <form onSubmit={onSubmit} className="space-y-3.5">
             <div>
               <label className="block text-[10px] uppercase tracking-wide text-app-onbg-muted mb-1">
                 Email
               </label>
               <input
                 className="input"
                 type="email"
                 name="email"
                 value={form.email}
                 onChange={onChange}
                 placeholder="you@example.com"
                 autoComplete="email"
                 required
               />
             </div>
             <div>
               <label className="block text-[10px] uppercase tracking-wide text-app-onbg-muted mb-1">
                 Password
               </label>
               <input
                 className="input"
                 type="password"
                 name="password"
                 value={form.password}
                 onChange={onChange}
                 placeholder="••••••••"
                 autoComplete="current-password"
                 required
               />
             </div>
             <button className="btn w-full py-2.5" disabled={loading} type="submit" aria-busy={loading}>
               {loading ? "Logging in..." : "Log in"}
             </button>
           </form>
 
           <div className="mt-5 text-center">
             <Link className="small-link" to="/signup">
               New here? Create an account
             </Link>
           </div>
         </div>
       </div>
     </section>
   );
 }

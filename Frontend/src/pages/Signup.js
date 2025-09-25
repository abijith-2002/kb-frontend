 /** 
  * PUBLIC_INTERFACE
  * Signup
  * Signup page that registers a new user with Supabase Auth using email/password.
  * On success, user is redirected to /dashboard. Uses Tailwind for styling.
  */
 import { useState } from "react";
 import { Link, useNavigate } from "react-router-dom";
 import supabase from "../lib/supabaseClient";
 import { authSignup, authLogin } from "../lib/apiClient";
 
 export default function Signup() {
   const navigate = useNavigate();
   const [form, setForm] = useState({ email: "", password: "", full_name: "" });
   const [loading, setLoading] = useState(false);
   const [err, setErr] = useState("");
 
   const onChange = (e) => {
     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
   };
 
   const onSubmit = async (e) => {
     e.preventDefault();
     setErr("");
     setLoading(true);
     try {
       // 1) Create user via backend
       await authSignup({
         email: form.email,
         password: form.password,
         full_name: form.full_name,
       });
       // 2) Immediately log in to obtain token/session (if backend requires email confirmation, this may fail)
       try {
         const tokenResp = await authLogin({
           email: form.email,
           password: form.password,
         });
         if (tokenResp?.access_token) {
           const { error: sessErr } = await supabase.auth.setSession({
             access_token: tokenResp.access_token,
             refresh_token: tokenResp.access_token,
           });
           if (sessErr) throw sessErr;
           navigate("/dashboard", { replace: true });
           return;
         }
       } catch (_e) {
         // If immediate login isn't possible (e.g., email confirmation required), route to login
         navigate("/login", { replace: true });
         return;
       }
       // Fallback: route to login
       navigate("/login", { replace: true });
     } catch (e2) {
       setErr(e2.message || "Failed to sign up.");
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <section className="min-h-[92vh] flex items-center justify-center px-4 py-6 overflow-hidden">
       <div className="w-full max-w-sm">
         <div className="card p-6">
           <div className="mb-5 text-center">
             <h1 className="auth-title text-xl">Create your account</h1>
             <p className="auth-subtle mt-1 text-xs">Start your KnowledgeBot journey</p>
           </div>
 
           {err && (
             <div className="mb-3 text-red-400/90 text-xs" role="alert" aria-live="polite">
               {err}
             </div>
           )}
 
           <form onSubmit={onSubmit} className="space-y-3.5">
             <div>
               <label className="block text-[10px] uppercase tracking-wide text-app-onbg-muted mb-1">
                 Full name (optional)
               </label>
               <input
                 className="input"
                 type="text"
                 name="full_name"
                 value={form.full_name}
                 onChange={onChange}
                 placeholder="Ada Lovelace"
                 autoComplete="name"
               />
             </div>
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
                 autoComplete="new-password"
                 required
               />
             </div>
             <button className="btn w-full py-2.5" disabled={loading} type="submit" aria-busy={loading}>
               {loading ? "Signing up..." : "Sign up"}
             </button>
           </form>
 
           <div className="mt-5 text-center">
             <Link className="small-link" to="/login">
               Already have an account? Log in
             </Link>
           </div>
         </div>
       </div>
     </section>
   );
 }

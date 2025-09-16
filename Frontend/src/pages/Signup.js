 /** 
  * PUBLIC_INTERFACE
  * Signup
  * Signup page that registers a new user with Supabase Auth using email/password.
  * On success, user is redirected to /dashboard. Uses Tailwind for styling.
  */
 import { useState } from "react";
 import { Link, useNavigate } from "react-router-dom";
 import supabase from "../lib/supabaseClient";
 
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
       const { data, error } = await supabase.auth.signUp({
         email: form.email,
         password: form.password,
         options: {
           data: { full_name: form.full_name || null },
           emailRedirectTo: process.env.REACT_APP_SITE_URL || window.location.origin,
         },
       });
       if (error) throw error;
 
       if (data.session) {
         navigate("/dashboard", { replace: true });
       } else {
         // Email confirmation likely needed; send to login.
         navigate("/login", { replace: true });
       }
     } catch (e2) {
       setErr(e2.message || "Failed to sign up.");
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <section className="min-h-screen flex items-center justify-center px-4 overflow-hidden">
       <div className="w-full max-w-md">
         <div className="card">
           <div className="mb-6 text-center">
             <h1 className="auth-title">Create your account</h1>
             <p className="auth-subtle mt-1">Start your KnowledgeBot journey</p>
           </div>
 
           {err && (
             <div className="mb-4 text-red-400 text-sm" role="alert" aria-live="polite">
               {err}
             </div>
           )}
 
           <form onSubmit={onSubmit} className="space-y-4">
             <div>
               <label className="block text-xs uppercase tracking-wide text-app-onbg/80 mb-1">
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
               <label className="block text-xs uppercase tracking-wide text-app-onbg/80 mb-1">
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
               <label className="block text-xs uppercase tracking-wide text-app-onbg/80 mb-1">
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
             <button className="btn w-full" disabled={loading} type="submit" aria-busy={loading}>
               {loading ? "Signing up..." : "Sign up"}
             </button>
           </form>
 
           <div className="mt-6 text-center">
             <Link className="small-link" to="/login">
               Already have an account? Log in
             </Link>
           </div>
         </div>
       </div>
     </section>
   );
 }

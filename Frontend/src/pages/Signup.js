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
     <section className="min-h-[92vh] flex items-center justify-center px-3 py-2 overflow-hidden">
       <div className="w-full max-w-sm">
         <div className="card p-4">
           <div className="mb-4 text-center">
             <h1 className="auth-title text-xl">Create your account</h1>
             <p className="auth-subtle mt-0.5 text-xs">Start your KnowledgeBot journey</p>
           </div>
 
           {err && (
             <div className="mb-3 text-red-400 text-xs" role="alert" aria-live="polite">
               {err}
             </div>
           )}
 
           <form onSubmit={onSubmit} className="space-y-3">
             <div>
               <label className="block text-[10px] uppercase tracking-wide text-app-onbg/80 mb-0.5">
                 Full name (optional)
               </label>
               <input
                 className="input py-1.5"
                 type="text"
                 name="full_name"
                 value={form.full_name}
                 onChange={onChange}
                 placeholder="Ada Lovelace"
                 autoComplete="name"
               />
             </div>
             <div>
               <label className="block text-[10px] uppercase tracking-wide text-app-onbg/80 mb-0.5">
                 Email
               </label>
               <input
                 className="input py-1.5"
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
               <label className="block text-[10px] uppercase tracking-wide text-app-onbg/80 mb-0.5">
                 Password
               </label>
               <input
                 className="input py-1.5"
                 type="password"
                 name="password"
                 value={form.password}
                 onChange={onChange}
                 placeholder="••••••••"
                 autoComplete="new-password"
                 required
               />
             </div>
             <button className="btn w-full py-2" disabled={loading} type="submit" aria-busy={loading}>
               {loading ? "Signing up..." : "Sign up"}
             </button>
           </form>
 
           <div className="mt-4 text-center">
             <Link className="small-link text-xs" to="/login">
               Already have an account? Log in
             </Link>
           </div>
         </div>
       </div>
     </section>
   );
 }

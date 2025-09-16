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

      // Some projects require email confirmation; if session exists, go to dashboard, otherwise inform user.
      if (data.session) {
        navigate("/dashboard", { replace: true });
      } else {
        // No session means email confirmation likely required.
        navigate("/login", { replace: true });
      }
    } catch (e2) {
      setErr(e2.message || "Failed to sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto w-full max-w-md mt-16 card">
        <h1 className="text-2xl font-bold mb-2">Create your account</h1>
        <p className="text-sm text-gray-600 mb-6">
          Already have an account? <Link className="text-kavia-orange" to="/login">Log in</Link>
        </p>

        {err && <div className="mb-4 text-red-600">{err}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full name (optional)</label>
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
            <label className="block text-sm mb-1">Email</label>
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
            <label className="block text-sm mb-1">Password</label>
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
          <button className="btn w-full" disabled={loading} type="submit">
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}

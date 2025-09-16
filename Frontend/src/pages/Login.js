/**
 * PUBLIC_INTERFACE
 * Login
 * Login page that authenticates the user via Supabase Auth using email/password.
 * On success, user is redirected to /dashboard. Uses Tailwind for styling.
 */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";

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
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      navigate("/dashboard", { replace: true });
    } catch (e2) {
      setErr(e2.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto w-full max-w-md mt-16 card">
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-sm text-gray-600 mb-6">
          New here? <Link className="text-kavia-orange" to="/signup">Create an account</Link>
        </p>

        {err && <div className="mb-4 text-red-600">{err}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
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
              autoComplete="current-password"
              required
            />
          </div>
          <button className="btn w-full" disabled={loading} type="submit">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * NavBar
 * Responsive navigation bar that shows app name and logout action when authenticated.
 */
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function NavBar() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setAuthed(!!data.session);
      setEmail(data.session?.user?.email || "");
    }
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAuthed(!!session);
      setEmail(session?.user?.email || "");
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const doLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-transparent">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-app-primary hover:text-app-primaryDark text-lg transition-colors">
          KnowledgeBot
        </Link>
        <div className="flex items-center gap-4">
          {authed ? (
            <>
              <span className="text-sm text-app-onbg-muted">{email}</span>
              <button className="btn" onClick={doLogout}>Logout</button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

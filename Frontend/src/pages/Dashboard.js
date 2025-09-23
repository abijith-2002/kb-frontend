/**
 * PUBLIC_INTERFACE
 * Dashboard
 * Initial dashboard showing the logged-in user's email from Supabase session.
 */
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function Dashboard() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setEmail(data.session?.user?.email || "");
    }
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setEmail(session?.user?.email || "");
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-[60vh] mx-auto max-w-5xl p-4">
      <div className="section">
        <div className="card">
          <h1 className="text-2xl font-bold mb-2 text-app-onbg">Dashboard</h1>
          <p className="text-app-onbg">
            Logged in as: <span className="font-semibold text-app-primary">{email}</span>
          </p>
          <p className="text-sm text-app-onbg-muted mt-4">
            Next steps: upload documents, create sessions, and chat. Open the new chat interface at <span className="text-app-primary font-medium">/chat</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

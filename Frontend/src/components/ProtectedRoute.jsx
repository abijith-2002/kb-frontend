/**
 * PUBLIC_INTERFACE
 * ProtectedRoute
 * A wrapper component that checks Supabase session state and either renders children
 * or redirects to /login. This enforces protected routes.
 */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";

export default function ProtectedRoute({ children }) {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function check() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsAuthed(!!data.session);
      setSessionChecked(true);
    }
    check();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (mounted) {
        setIsAuthed(!!sess);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!sessionChecked) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

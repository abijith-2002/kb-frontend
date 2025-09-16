/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * This module initializes and exports a singleton Supabase client instance using
 * environment variables:
 *  - REACT_APP_SUPABASE_URL
 *  - REACT_APP_SUPABASE_ANON_KEY
 * Do not hardcode values; ensure .env is configured in the deployment environment.
 */
import { createClient } from "@supabase/supabase-js";

let client;

/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Returns a singleton Supabase client instance configured from environment variables.
 */
export function getSupabaseClient() {
  if (!client) {
    const url = process.env.REACT_APP_SUPABASE_URL;
    const anon = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!url || !anon) {
      // eslint-disable-next-line no-console
      console.warn(
        "Supabase env vars missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY."
      );
    }

    client = createClient(url || "", anon || "", {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

export default getSupabaseClient();

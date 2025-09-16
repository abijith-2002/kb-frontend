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
 * Throws a descriptive error if required variables are missing.
 */
export function getSupabaseClient() {
  if (!client) {
    const url = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

    // Helpful debug log (non-sensitive: only shows if set, not the actual key)
    // eslint-disable-next-line no-console
    console.debug(
      "[Supabase] Initializing client",
      {
        hasUrl: Boolean(url),
        hasAnonKey: Boolean(supabaseKey),
        // Do not log actual values to avoid leaking secrets
      }
    );

    if (!url) {
      throw new Error(
        "Supabase URL is required. Please set REACT_APP_SUPABASE_URL in your environment."
      );
    }
    if (!supabaseKey) {
      throw new Error(
        "Supabase anon key is required. Please set REACT_APP_SUPABASE_ANON_KEY in your environment."
      );
    }

    client = createClient(url, supabaseKey, {
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

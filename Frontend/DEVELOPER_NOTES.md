# Developer Notes

After pulling changes, run:
- npm install
- npm start

Tailwind is configured via postcss.config.js and tailwind.config.js. Styles are activated by the @tailwind directives in src/index.css. No additional CRA config is required.

Environment variables required (see .env.example):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_ANON_KEY
- REACT_APP_API_BASE
- REACT_APP_SITE_URL (optional for email redirect)

Notes:
- If you see a runtime error like "Supabase anon key is required" (or previously "supabaseKey is required"), ensure both REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in your environment. The Supabase client now reads REACT_APP_SUPABASE_ANON_KEY and throws a clear error if missing. A debug log will indicate presence of values without printing secrets.

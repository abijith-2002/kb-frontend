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

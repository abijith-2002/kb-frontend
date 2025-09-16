# Frontend Auth + Tailwind Setup Notes

- Dependencies added: @supabase/supabase-js, react-router-dom, tailwindcss, postcss, autoprefixer.
- Config files added: tailwind.config.js, postcss.config.js.
- Tailwind directives inserted into src/index.css.
- Supabase client initialized in src/lib/supabaseClient.js using:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_ANON_KEY
- Routes:
  - /login, /signup (public)
  - /dashboard (protected)
- Protected route enforcement in src/components/ProtectedRoute.jsx.
- Nav bar includes login/signup buttons or email + logout action.
- .env.example created. For email confirmation flows, set REACT_APP_SITE_URL for redirects.

Run:
- npm install
- npm start

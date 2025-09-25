import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { ApiConfigProvider } from "./lib/useApiConfig";
import ApiStatusAndConfig from "./components/ApiStatusAndConfig";

/**
 * PUBLIC_INTERFACE
 * App
 * Main application component that wires up React Router routes, Supabase-protected routes,
 * and the top navigation bar. Routes:
 *  - /           -> redirects to /dashboard or /login depending on session (handled via ProtectedRoute and login page)
 *  - /login      -> Login page
 *  - /signup     -> Signup page
 *  - /dashboard  -> Protected dashboard page
 */
function App() {
  return (
    <BrowserRouter>
      <ApiConfigProvider>
        {/* Global app wrapper uses bg-app-bg which maps to #232628 */}
        <div className="min-h-screen flex flex-col bg-app-bg text-app-onbg overflow-hidden">
          <NavBar />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          {/* Persistent online/offline indicator + config dialog */}
          <ApiStatusAndConfig />
        </div>
      </ApiConfigProvider>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

/**
 * PUBLIC_INTERFACE
 * App
 * Main application component that wires up React Router routes, Supabase-protected routes,
 * and the top navigation bar. Routes:
 *  - /           -> redirects to /chat
 *  - /login      -> Login page
 *  - /signup     -> Signup page
 *  - /dashboard  -> Protected dashboard page
 *  - /chat       -> Protected chat page (new)
 */
function App() {
  return (
    <BrowserRouter>
      {/* Global app wrapper uses bg-app-bg which maps to #232628 */}
      <div className="min-h-screen flex flex-col bg-app-bg text-app-onbg overflow-hidden">
        <NavBar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
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
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

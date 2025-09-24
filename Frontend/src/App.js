import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";

/**
 * PUBLIC_INTERFACE
 * App
 * Main application component that wires up React Router routes, Supabase-protected routes,
 * and the top navigation bar. Routes:
 *  - /           -> redirects to /chat
 *  - /login      -> Login page
 *  - /signup     -> Signup page
 *  - /chat       -> Protected chat page
 */
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-canvas text-primary overflow-hidden">
        <NavBar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
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

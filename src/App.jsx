import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import ConfigBanner from "./components/ConfigBanner";
import LoadingSpinner from "./components/LoadingSpinner";

function MainContent() {
  const { currentUser, loading, isFirebaseConfigured } = useAuth();
  const [authView, setAuthView] = useState("login"); // "login" | "register"

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner message="Connecting to ChatSpace..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* If Firebase credentials are missing/placeholder, show setup guide */}
      {!isFirebaseConfigured && <ConfigBanner />}

      {currentUser ? (
        <Chat />
      ) : authView === "login" ? (
        <Login onSwitchToRegister={() => setAuthView("register")} />
      ) : (
        <Register onSwitchToLogin={() => setAuthView("login")} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

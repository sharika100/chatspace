import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase";
import { AuthContext } from "./authContextInstance";
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logout as authLogout,
} from "../services/authService";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(isFirebaseConfigured && auth));
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setAuthError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const user = await loginWithEmail(email, password);
      return user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const register = async (email, password, displayName) => {
    setAuthError(null);
    try {
      const user = await registerWithEmail(email, password, displayName);
      return user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const signInGoogle = async () => {
    setAuthError(null);
    try {
      const user = await loginWithGoogle();
      return user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await authLogout();
      setCurrentUser(null);
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const clearError = () => setAuthError(null);

  const value = {
    currentUser,
    loading,
    authError,
    login,
    register,
    signInGoogle,
    logout,
    clearError,
    isFirebaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

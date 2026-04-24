// src/features/auth/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { getMe, loginUser, registerUser, logoutUser } from "./services/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // logged-in user object or null
  const [loading, setLoading] = useState(true);   // true while getMe is running on load

  // ── Runs once on app load 
  // Silently checks if a valid JWT cookie exists and restores the session
  useEffect(() => {
    const restoreSession = async () => {  //restoreSession is used if user reload still remain login 
      try {
        const data = await getMe();
        setUser(data.user);   // ← adjust "data.user" to match your backend response shape
      } catch (err) {
        console.error("Session restore failed", err);
        setUser(null);       // cookie missing or expired — treat as logged out
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ── Auth actions 

  const login = useCallback(async (formData) => {
    const data = await loginUser(formData);
    setUser(data.user);       // backend sets cookie, we just store user in state
    return data;
  }, []);

  const register = useCallback(async (formData) => {
    const data = await registerUser(formData);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);            // backend clears cookie, we clear local state
  }, []);

  // ── Derived helpers 

  const isAuthenticated = !!user;
  const isVendor = user?.role === "vendor";
  const isCustomer = user?.role === "customer";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isVendor,
        isCustomer,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
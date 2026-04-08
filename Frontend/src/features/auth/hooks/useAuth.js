// src/features/auth/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
};

export default useAuth;
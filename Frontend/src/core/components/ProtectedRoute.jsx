// src/core/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";

const ProtectedRoute = ({ children, vendorOnly = false }) => {
  const { user, loading, isVendor } = useAuth();

  // Wait for getMe to finish before making any routing decision
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  // Not logged in → send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not a vendor → send to home
  if (vendorOnly && !isVendor) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
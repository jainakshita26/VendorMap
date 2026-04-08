// src/core/components/GuestRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";

const GuestRoute = ({ children }) => {
  const { user, loading, isVendor } = useAuth();

  // wait for session restore
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  // already logged in — redirect to correct place
  if (user) {
    return <Navigate to={isVendor ? "/vendor/dashboard" : "/shops"} replace />;
  }

  return children;
};

export default GuestRoute;
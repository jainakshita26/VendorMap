// src/App.jsx
import AppRoutes from "./routes/app.routes";
import Navbar from "./core/components/Navbar";
import GlobalLoader from "./core/components/GlobalLoader";
import useAuth from "./features/auth/hooks/useAuth";

function App() {
  const { loading } = useAuth();

  // block entire app until session is restored
  if (loading) return <GlobalLoader />;

  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
}

export default App;
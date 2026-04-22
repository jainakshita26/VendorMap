// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../core/components/ProtectedRoute";
import GuestRoute from "../core/components/GuestRoute";

// Pages
import HomePage from "../features/home/pages/HomePage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ShopListPage from "../features/shop/pages/ShopListPage";
import ShopDetailPage from "../features/shop/pages/ShopDetailPage";
import VendorDashboard from "../features/vendor/pages/VendorDashboard";
import NotFoundPage from "../core/pages/NotFoundPage";
import SearchPage from "../features/search/pages/SearchPage";
import FavouritesPage from "../features/shop/pages/FavouritePage";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ── Public ─────────────────────────────────────────── */}
      <Route path="/" element={<HomePage />} />
      <Route path="/shops" element={<ShopListPage />} />
      <Route path="/shops/:id" element={<ShopDetailPage />} />
      <Route path="/search" element={<SearchPage />} />

      {/* ── Guest only ─────────────────────────────────────── */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      {/* ── Vendor only ────────────────────────────────────── */}
      <Route
        path="/vendor/dashboard"
        element={
          <ProtectedRoute vendorOnly>
            <VendorDashboard />
          </ProtectedRoute>
        }
      />

      {/* ── 404 ────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />

      <Route
        path="/favourites"
        element={
          <ProtectedRoute>
            <FavouritesPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;


// ### What we removed and why

// The old `"/"` protected route is gone — homepage is now **public**. Logged-in users see extra buttons based on their role, guests see the Join as Vendor CTA.

// ---

// ### Complete app flow now
// ```
// /              → HomePage       (public, role-aware buttons)
// /shops         → ShopListPage   (public)
// /shops/:id     → ShopDetailPage (public)
// /login         → LoginPage      (guest only)
// /register      → RegisterPage   (guest only)
// /vendor/dashboard → VendorDashboard (vendor only)
// /*             → NotFoundPage
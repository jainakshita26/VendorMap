// src/core/components/Navbar.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";

const Navbar = () => {
  const { user, isVendor, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5"
      : "text-gray-500 hover:text-gray-800";

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Left — Logo ─────────────────────────────────── */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <span className="text-2xl">🏪</span>
          <span className="text-lg font-bold text-gray-800">
            Vendor<span className="text-blue-600">Map</span>
          </span>
        </div>

        {/* ── Center — Nav Links + Search (desktop) ────────── */}
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <span
            onClick={() => navigate("/")}
            className={`text-sm cursor-pointer transition ${isActive("/")}`}
          >
            Home
          </span>
          <span
            onClick={() => navigate("/shops")}
            className={`text-sm cursor-pointer transition ${isActive("/shops")}`}
          >
            Shops
          </span>
          {isAuthenticated && isVendor && (
            <span
              onClick={() => navigate("/vendor/dashboard")}
              className={`text-sm cursor-pointer transition ${isActive("/vendor/dashboard")}`}
            >
              Dashboard
            </span>
          )}

          {/* ── Search bar — desktop center ──────────────── */}
          <button
            onClick={() => navigate("/search")}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-400 transition w-44"
          >
            <span>🔍</span>
            <span>Search products...</span>
          </button>
        </div>

        {/* ── Right — Auth (desktop) ───────────────────────── */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium transition px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-lg transition"
              >
                Register
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-blue-600">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-semibold text-gray-800">
                    {user?.name}
                  </span>
                  <span className="text-xs text-gray-400 capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 font-medium px-3 py-1.5 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* ── Mobile — Search icon + Hamburger ────────────── */}
        <div className="md:hidden flex items-center gap-3">
          {/* Search icon on mobile */}
          <button
            onClick={() => navigate("/search")}
            className="text-gray-500 hover:text-blue-600 transition text-xl"
          >
            🔍
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex flex-col gap-1.5 p-1 focus:outline-none"
          >
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

      </div>

      {/* ── Mobile Menu ─────────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-1">

          {/* Search bar — full width on mobile */}
          <button
            onClick={() => { navigate("/search"); setMenuOpen(false); }}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400 mb-3"
          >
            <span>🔍</span>
            <span>Search products...</span>
          </button>

          {/* Nav links */}
          <button
            onClick={() => { navigate("/"); setMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition
              ${location.pathname === "/" ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Home
          </button>

          <button
            onClick={() => { navigate("/shops"); setMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition
              ${location.pathname === "/shops" ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Shops
          </button>

          {isAuthenticated && isVendor && (
            <button
              onClick={() => { navigate("/vendor/dashboard"); setMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition
                ${location.pathname === "/vendor/dashboard" ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Dashboard
            </button>
          )}

          {/* Divider */}
          <div className="pt-2 border-t border-gray-100 mt-2">
            {!isAuthenticated ? (
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => { navigate("/login"); setMenuOpen(false); }}
                  className="w-full text-sm text-gray-600 font-medium px-3 py-2.5 rounded-lg hover:bg-gray-50 text-left transition"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate("/register"); setMenuOpen(false); }}
                  className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-2.5 rounded-lg text-center transition"
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-gray-800">
                      {user?.name}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full text-sm text-red-500 hover:bg-red-50 font-medium px-3 py-2.5 rounded-lg text-left transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


// ### What changed

// | Before | After |
// |---|---|
// | Search button hidden on mobile with `hidden md:flex` | 🔍 icon always visible on mobile next to hamburger |
// | Search in wrong place in mobile menu | Full width search bar at top of mobile menu |
// | Search was outside center links on desktop | Search bar sits inside center links group |

// ---

// ### Desktop layout now
// ```
// [🏪 VendorMap]    [Home  Shops  Dashboard  🔍 Search...]    [Avatar  Logout]
// ```

// ### Mobile layout now
// ```
// [🏪 VendorMap]                              [🔍  ☰]
// src/features/home/pages/HomePage.jsx
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";

const HomePage = () => {
  const navigate  = useNavigate();
  const { isAuthenticated, isVendor } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">

          <span className="text-6xl">🏪</span>

          <h1 className="text-4xl font-bold text-gray-800 mt-6 leading-tight">
            Discover Local Shops
            <span className="text-blue-600"> Near You</span>
          </h1>

          <p className="text-gray-500 text-lg mt-4 max-w-xl mx-auto">
            Browse offline vendors, explore their products, and support
            local businesses in your area.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => navigate("/shops")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg text-sm transition duration-200"
            >
              Browse Shops
            </button>

            {!isAuthenticated && (
              <button
                onClick={() => navigate("/register")}
                className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg text-sm border border-gray-200 transition duration-200"
              >
                Join as Vendor
              </button>
            )}

            {isAuthenticated && isVendor && (
              <button
                onClick={() => navigate("/vendor/dashboard")}
                className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg text-sm border border-gray-200 transition duration-200"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
          Why VendorMap?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-3">
            <span className="text-4xl">📍</span>
            <h3 className="text-base font-semibold text-gray-800">
              Location Based
            </h3>
            <p className="text-sm text-gray-500">
              Find shops and vendors closest to your location instantly.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-3">
            <span className="text-4xl">🛍️</span>
            <h3 className="text-base font-semibold text-gray-800">
              Browse Products
            </h3>
            <p className="text-sm text-gray-500">
              Explore what each shop offers before you visit them.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-3">
            <span className="text-4xl">🏪</span>
            <h3 className="text-base font-semibold text-gray-800">
              Sell Locally
            </h3>
            <p className="text-sm text-gray-500">
              Vendors can list their shop and products in minutes.
            </p>
          </div>

        </div>
      </div>

      {/* CTA Section — only for guests */}
      {!isAuthenticated && (
        <div className="bg-blue-600 py-14">
          <div className="max-w-2xl mx-auto px-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Are you a vendor?
            </h2>
            <p className="text-blue-100 text-sm">
              Create your shop, list your products, and reach customers
              in your area for free.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg text-sm hover:bg-blue-50 transition duration-200"
            >
              Get Started Free
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;
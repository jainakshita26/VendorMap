// src/features/auth/components/RegisterForm.jsx
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getCurrentCoordinates, buildLocation } from "../../../core/utils/location";

const passwordRules = [
  { id: "length",    label: "At least 8 characters",                test: (p) => p.length >= 8 },
  { id: "uppercase", label: "At least 1 uppercase letter",          test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "At least 1 lowercase letter",          test: (p) => /[a-z]/.test(p) },
  { id: "number",    label: "At least 1 number",                    test: (p) => /\d/.test(p) },
  { id: "special",   label: "At least 1 special character (@$!%*?&)", test: (p) => /[@$!%*?&]/.test(p) },
];

const isPasswordValid = (p) => passwordRules.every((rule) => rule.test(p));

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    location: "",
  });

  const [passwordTouched, setPasswordTouched] = useState(false);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  if (!isPasswordValid(formData.password)) {
    setError("Please fix the password requirements before submitting.");
    return;
  }

  setLoading(true);

  try {
    let locationData = null;

    /*
      THREE STEP LOCATION STRATEGY:

      Step 1 — Try GPS first (most accurate, works in villages)
      Step 2 — GPS denied? → geocode the typed city name
      Step 3 — Geocoding failed? → save address only with [0,0]

      This way we ALWAYS get some location data
    */

    try {
      /*
        STEP 1 — Browser GPS
        Ask browser for current satellite coordinates
        If user clicks Allow → we get exact coordinates
        If user clicks Deny → throws error → go to step 2
      */
      const { coordinates } = await getCurrentCoordinates();
      locationData = buildLocation(coordinates, formData.location);

    } catch {
      /*
        STEP 2 — Geocoding
        User denied GPS → try to convert typed city to coordinates
        "Indore, MP" → OpenStreetMap → [75.85, 22.71]
      */
      const geocoded = await geocodeAddress(formData.location);

      if (geocoded) {
        /*
          Geocoding worked → use those coordinates
          Not as accurate as GPS but much better than [0,0]
        */
        locationData = buildLocation(
          geocoded.coordinates,
          formData.location
        );
      } else {
        /*
          STEP 3 — Complete fallback
          GPS denied AND geocoding failed (very remote area or typo)
          Save address as text, coordinates as [0,0]
          App still works, nearby feature won't work for this user
        */
        locationData = buildLocation([0, 0], formData.location);
      }
    }

    const data = await register({
      ...formData,
      location: locationData,
    });

    const role = data?.user?.role;
    navigate(role === "vendor" ? "/vendor/dashboard" : "/shops");

  } catch (err) {
    setError(err?.response?.data?.message || "Registration failed.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Create an account</h2>
          <p className="text-sm text-gray-500 mt-1">Join the marketplace today</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text" name="name" value={formData.name}
              onChange={handleChange} required placeholder="John Doe"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" name="email" value={formData.email}
              onChange={handleChange} required placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" name="password" value={formData.password}
              onChange={handleChange}
              onFocus={() => setPasswordTouched(true)}
              required placeholder="••••••••"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition
                ${passwordTouched && !isPasswordValid(formData.password)
                  ? "border-red-400 focus:ring-red-400"
                  : passwordTouched && isPasswordValid(formData.password)
                  ? "border-green-400 focus:ring-green-400"
                  : "border-gray-300 focus:ring-blue-500"
                }`}
            />
            {passwordTouched && (
              <ul className="mt-2 space-y-1">
                {passwordRules.map((rule) => {
                  const passed = rule.test(formData.password);
                  return (
                    <li key={rule.id}
                      className={`flex items-center gap-2 text-xs transition-colors duration-200 ${passed ? "text-green-600" : "text-red-500"}`}
                    >
                      <span className="text-base leading-none">{passed ? "✓" : "✗"}</span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
            <select
              name="role" value={formData.role} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
              <span className="text-gray-400 font-normal text-xs ml-1">
                (📍 coordinates auto-detected)
              </span>
            </label>
            <input
              type="text" name="location" value={formData.location}
              onChange={handleChange} required placeholder="City, State e.g. Indore, MP"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <p className="text-xs text-gray-400 mt-1">
              Your browser will ask for location permission to find nearby shops.
            </p>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition duration-200"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}
            className="text-blue-600 font-medium cursor-pointer hover:underline">
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default RegisterForm;
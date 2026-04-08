// src/features/vendor/components/CreateShopForm.jsx
import { useState } from "react";
import { getCurrentCoordinates, buildLocation } from "../../../core/utils/location";
import useAuth from "../../auth/hooks/useAuth";

const CATEGORIES = [
  "Food & Beverages", "Clothing & Apparel", "Electronics",
  "Home & Living", "Beauty & Personal Care", "Books & Stationery",
  "Sports & Fitness", "Toys & Games", "Jewelry & Accessories", "Other",
];

const CreateShopForm = ({ onSubmit }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    shopName: "",
    location: user?.location?.address || "", // ✅ pre-fill from user profile
    category: "",
    shopImage: "",
    description: "",
  });

  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    let locationData = null;

    try {
      // Step 1 — GPS
      const { coordinates } = await getCurrentCoordinates();
      locationData = buildLocation(coordinates, formData.location);

    } catch {
      // Step 2 — Geocoding
      const geocoded = await geocodeAddress(formData.location);

      if (geocoded) {
        locationData = buildLocation(geocoded.coordinates, formData.location);
      } else {
        // Step 3 — fallback to user's saved coordinates
        locationData = buildLocation(
          user?.location?.coordinates || [0, 0],
          formData.location
        );
      }
    }

    await onSubmit({ ...formData, location: locationData });

  } catch (err) {
    setError(err?.response?.data?.message || "Failed to create shop.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8">

        <div className="mb-6 text-center">
          <span className="text-4xl">🏪</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Create Your Shop</h2>
          <p className="text-sm text-gray-500 mt-1">Set up your store and start selling</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
            <input
              type="text" name="shopName" value={formData.shopName}
              onChange={handleChange} required placeholder="e.g. Fresh Bakes"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category" value={formData.category}
              onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
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
              onChange={handleChange} required placeholder="e.g. Indore, MP"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Image URL{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url" name="shopImage" value={formData.shopImage}
              onChange={handleChange} placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {formData.shopImage && (
              <div className="mt-2 w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={formData.shopImage} alt="Shop preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="description" value={formData.description}
              onChange={handleChange} rows={3}
              placeholder="Tell customers what your shop is about..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition duration-200"
          >
            {loading ? "Creating shop..." : "Create Shop"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateShopForm;
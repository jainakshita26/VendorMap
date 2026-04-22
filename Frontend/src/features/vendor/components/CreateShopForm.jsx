// src/features/vendor/components/CreateShopForm.jsx
import { useState, useRef } from "react";
import { getCurrentCoordinates, buildLocation, geocodeAddress } from "../../../core/utils/location";
import useAuth from "../../auth/hooks/useAuth";

const CATEGORIES = [
  "Food & Beverages", "Clothing & Apparel", "Electronics",
  "Home & Living", "Beauty & Personal Care", "Books & Stationery",
  "Sports & Fitness", "Toys & Games", "Jewelry & Accessories", "Other",
];

const CreateShopForm = ({ onSubmit }) => {
  const { user } = useAuth();
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    shopName: "",
    location: user?.location?.address || "",
    category: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);   // actual file
  const [preview, setPreview]     = useState(null);   // blob URL for preview
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file)); // instant preview, no upload yet
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
          // Step 3 — fallback
          locationData = buildLocation(
            user?.location?.coordinates || [0, 0],
            formData.location
          );
        }
      }

      // Build FormData instead of plain object
      const data = new FormData();
      data.append("shopName", formData.shopName);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("location", JSON.stringify(locationData)); // location as JSON string
      if (imageFile) data.append("shopImage", imageFile);   // only if file chosen

      await onSubmit(data); // hook receives FormData directly

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

          {/* ---- Image upload (replaces URL input) ---- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Image
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>

            {/* Clickable preview box */}
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:border-blue-400 transition flex items-center justify-center bg-gray-50"
            >
              {preview ? (
                <img
                  src={preview} alt="Shop preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-3xl mb-1">📷</div>
                  <p className="text-xs">Click to upload image</p>
                </div>
              )}
            </div>

            {/* Show filename + change option after picking */}
            {imageFile && (
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span className="truncate max-w-xs">{imageFile.name}</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-blue-600 underline ml-2 shrink-0"
                >
                  Change
                </button>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
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
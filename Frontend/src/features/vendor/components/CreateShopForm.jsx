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
    shopName:    "",
    location:    user?.location?.address || "",
    category:    "",
    description: "",
    phone:       "", // ← add
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState(null);
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let locationData = null;

      try {
        const { coordinates } = await getCurrentCoordinates();
        locationData = buildLocation(coordinates, formData.location);
      } catch {
        const geocoded = await geocodeAddress(formData.location);
        if (geocoded) {
          locationData = buildLocation(geocoded.coordinates, formData.location);
        } else {
          locationData = buildLocation(
            user?.location?.coordinates || [0, 0],
            formData.location
          );
        }
      }

      const data = new FormData();
      data.append("shopName",    formData.shopName);
      data.append("category",    formData.category);
      data.append("description", formData.description);
      data.append("phone",       formData.phone);       // ← add
      data.append("location",    JSON.stringify(locationData));
      if (imageFile) data.append("shopImage", imageFile);

      await onSubmit(data);
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

          {/* ── Phone number ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">
                +91
              </span>
              <input
                type="tel" name="phone" value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                maxLength={10}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Customers will see a "Call Shop" button on your shop page
            </p>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Image
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:border-blue-400 transition flex items-center justify-center bg-gray-50"
            >
              {preview ? (
                <img src={preview} alt="Shop preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-3xl mb-1">📷</div>
                  <p className="text-xs">Click to upload image</p>
                </div>
              )}
            </div>
            {imageFile && (
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span className="truncate max-w-xs">{imageFile.name}</span>
                <button type="button" onClick={() => fileInputRef.current.click()}
                  className="text-blue-600 underline ml-2 shrink-0">
                  Change
                </button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*"
              onChange={handleImageChange} className="hidden" />
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
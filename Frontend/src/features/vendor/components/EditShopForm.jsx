// src/features/vendor/components/EditShopForm.jsx
import { useState } from "react";

/*
  EditShopForm:
  Shows current shop image + description
  Vendor can update either or both
  
  Props:
  shop     → current shop data (to pre-fill form)
  onSubmit → handler from useVendorShop
  onClose  → close the edit form
*/
const EditShopForm = ({ shop, onSubmit, onClose }) => {
  /*
    Pre-fill form with current shop data
    Vendor sees their current values and can change them
  */
  const [formData, setFormData] = useState({
    shopImage:   shop.shopImage   || "",
    description: shop.description || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
      setSuccess(true);
      // close form after 1.5 seconds
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update shop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">
          Edit Shop Profile
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl transition"
        >
          ✕
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
          ✓ Shop updated successfully
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Shop Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Image URL
          </label>
          <input
            type="url"
            name="shopImage"
            value={formData.shopImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />

          {/*
            Live image preview:
            As soon as vendor pastes a URL → show preview
            If URL is broken → hide image silently (onError)
          */}
          {formData.shopImage && (
            <div className="mt-2 w-full h-32 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={formData.shopImage}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Tell customers what your shop is about..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
          {/* character count */}
          <p className="text-xs text-gray-400 mt-1 text-right">
            {formData.description.length} characters
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditShopForm;
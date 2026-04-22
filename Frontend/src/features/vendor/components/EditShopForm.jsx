// src/features/vendor/components/EditShopForm.jsx
import { useState, useRef } from "react";

const EditShopForm = ({ shop, onSubmit, onClose }) => {
  const [description, setDescription] = useState(shop.description || "");
  const [imageFile, setImageFile]     = useState(null);
  const [preview, setPreview]         = useState(shop.shopImage || null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(false);
  const fileInputRef                  = useRef();

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
      const formData = new FormData();
      formData.append("description", description);
      if (imageFile) formData.append("shopImage", imageFile);

      await onSubmit(formData);
      setSuccess(true);
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
        <h3 className="text-base font-semibold text-gray-800">Edit Shop Profile</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl transition">
          ✕
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
          ✓ Shop updated successfully
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shop Image
          </label>

          {/* Clickable preview box */}
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:border-blue-400 transition flex items-center justify-center bg-gray-50"
          >
            {preview ? (
              <img src={preview} alt="shop" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-3xl mb-1">🏪</div>
                <p className="text-xs">Click to upload image</p>
              </div>
            )}
          </div>

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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Tell customers what your shop is about..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {description.length} characters
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="submit" disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button" onClick={onClose}
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
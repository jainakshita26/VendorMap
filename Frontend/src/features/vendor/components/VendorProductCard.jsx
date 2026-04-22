import { useState, useRef } from "react";
import { generateProductDescription } from "../services/ai.api";

const UNITS = ["piece", "kg", "g", "L", "ml", "dozen", "pack", "box", "bottle"];

const VendorProductCard = ({ product, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing]         = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [aiLoading, setAiLoading]         = useState(false);
  const [aiError, setAiError]             = useState(null);

  const [formData, setFormData] = useState({
    name:          product.name,
    price:         product.price,
    discountPrice: product.discountPrice || "",
    unit:          product.unit || "piece",
    description:   product.description || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState(product.image || null);
  const fileInputRef              = useRef();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleGenerate = async () => {
    if (!formData.name.trim()) {
      setAiError("Product name is required");
      return;
    }
    setAiError(null);
    setAiLoading(true);
    try {
      const data = await generateProductDescription(formData.name);
      setFormData((prev) => ({ ...prev, description: data.description }));
    } catch (err) {
      setAiError("Failed to generate. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // ── Update ─────────────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    // validate discount < price
    if (formData.discountPrice && Number(formData.discountPrice) >= Number(formData.price)) {
      setError("Discount price must be less than original price");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name",          formData.name);
      data.append("price",         Number(formData.price));
      data.append("discountPrice", formData.discountPrice ? Number(formData.discountPrice) : "");
      data.append("unit",          formData.unit);
      data.append("description",   formData.description);
      if (imageFile) data.append("image", imageFile);

      await onUpdate(product._id, data);
      setIsEditing(false);
      setImageFile(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(product._id);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete product.");
      setLoading(false);
    }
  };

  // ── View mode ──────────────────────────────────────────────
  if (!isEditing) {
    const hasDiscount = product.discountPrice &&
      product.discountPrice > 0 &&
      product.discountPrice < product.price;

    const discountPercent = hasDiscount
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Image */}
        <div className="w-full h-36 bg-gray-100 overflow-hidden relative">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <span className="text-3xl">📦</span>
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-1">
          <h4 className="text-sm font-semibold text-gray-800">{product.name}</h4>
          {product.description && (
            <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            {hasDiscount ? (
              <>
                <span className="text-base font-bold text-blue-600">₹{product.discountPrice}</span>
                <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-base font-bold text-blue-600">₹{product.price}</span>
            )}
            {product.unit && product.unit !== "piece" && (
              <span className="text-xs text-gray-400">/ {product.unit}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition"
          >
            ✏️ Edit
          </button>
          {deleteConfirm ? (
            <div className="flex-1 flex gap-1">
              <button
                onClick={handleDelete} disabled={loading}
                className="flex-1 text-xs font-medium bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
              >
                {loading ? "..." : "Confirm"}
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="flex-1 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition"
            >
              🗑️ Delete
            </button>
          )}
        </div>

        {error && <p className="px-4 pb-3 text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  // ── Edit mode ──────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-4">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">Edit Product</h4>

      {error && (
        <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-3">

        {/* Name */}
        <input
          type="text" name="name" value={formData.name}
          onChange={handleChange} required placeholder="Product name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />

        {/* Price + Unit */}
        <div className="flex gap-2">
          <input
            type="number" name="price" value={formData.price}
            onChange={handleChange} required min="0" placeholder="Price"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <select
            name="unit" value={formData.unit} onChange={handleChange}
            className="w-24 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        {/* Discount price */}
        <div>
          <input
            type="number" name="discountPrice" value={formData.discountPrice}
            onChange={handleChange} min="0" placeholder="Discount price (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {/* Live preview */}
          {formData.discountPrice && formData.price &&
           Number(formData.discountPrice) < Number(formData.price) && (
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="text-blue-600 font-semibold">₹{formData.discountPrice}</span>
              <span className="text-gray-400 line-through">₹{formData.price}</span>
              <span className="bg-red-100 text-red-600 font-medium px-1.5 py-0.5 rounded-full">
                {Math.round(((formData.price - formData.discountPrice) / formData.price) * 100)}% OFF
              </span>
            </div>
          )}
          {formData.discountPrice && formData.price &&
           Number(formData.discountPrice) >= Number(formData.price) && (
            <p className="text-xs text-red-500 mt-1">
              Discount price must be less than original price
            </p>
          )}
        </div>

        {/* Image upload */}
        <div>
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full h-28 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:border-blue-400 transition flex items-center justify-center bg-gray-50"
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-xl mb-1">📷</div>
                <p className="text-xs">Click to change image</p>
              </div>
            )}
          </div>
          {imageFile && (
            <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
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

        {/* Description + AI */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Description</span>
            <button
              type="button" onClick={handleGenerate}
              disabled={aiLoading || !formData.name.trim()}
              className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {aiLoading
                ? <><span className="animate-spin">⟳</span> Generating...</>
                : <>✨ Generate</>
              }
            </button>
          </div>
          {aiError && <p className="text-xs text-red-500 mb-1">{aiError}</p>}
          <textarea
            name="description" value={formData.description}
            onChange={handleChange} rows={2}
            placeholder="Description or click ✨ Generate..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="submit" disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setError(null);
              setAiError(null);
              setImageFile(null);
              setPreview(product.image || null);
            }}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-lg transition"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default VendorProductCard;
// src/features/vendor/components/VendorProductCard.jsx
import { useState } from "react";

const VendorProductCard = ({ product, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    description: product.description || "",
    image: product.image || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ── Update ─────────────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onUpdate(product._id, {
        ...formData,
        price: Number(formData.price),
      });
      setIsEditing(false);
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
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Image */}
        <div className="w-full h-36 bg-gray-100 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <span className="text-3xl">📦</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-1">
          <h4 className="text-sm font-semibold text-gray-800">
            {product.name}
          </h4>
          {product.description && (
            <p className="text-xs text-gray-500 line-clamp-2">
              {product.description}
            </p>
          )}
          <p className="text-base font-bold text-blue-600">
            ₹{product.price}
          </p>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition"
          >
            ✏️ Edit
          </button>

          {/* Delete with confirm */}
          {deleteConfirm ? (
            <div className="flex-1 flex gap-1">
              <button
                onClick={handleDelete}
                disabled={loading}
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

        {error && (
          <p className="px-4 pb-3 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }

  // ── Edit mode ──────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-4">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">
        Edit Product
      </h4>

      {error && (
        <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-3">

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Product name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          placeholder="Price"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />

        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          placeholder="Description (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setError(null);
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




// ### Key details

// **Delete confirmation flow** — no accidental deletes:
// ```
// Click 🗑️ Delete → shows "Confirm / Cancel" 
// Click Confirm   → actually deletes
// Click Cancel    → goes back to normal
// ```

// **Edit mode** — card transforms in place:
// ```
// Click ✏️ Edit  → card becomes an inline edit form
// Click Cancel   → card goes back to view mode
// Blue border    → visually signals edit mode
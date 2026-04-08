// src/features/vendor/components/AddProductForm.jsx
import { useState } from "react";

const EMPTY_FORM = {
  name: "",
  price: "",
  description: "",
  image: "",
};

const AddProductForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        price: Number(formData.price), // ensure price is a number
      });
      setFormData(EMPTY_FORM); // reset form after success
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // hide after 3s
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      {/* Header */}
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Add New Product
      </h3>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
          ✓ Product added successfully
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Chocolate Cake"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            placeholder="e.g. 299"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/product.jpg"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {/* Live preview */}
          {formData.image && (
            <div className="mt-2 w-full h-28 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={formData.image}
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
            Description{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            placeholder="Brief description of the product..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition duration-200"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>

      </form>
    </div>
  );
};

export default AddProductForm;
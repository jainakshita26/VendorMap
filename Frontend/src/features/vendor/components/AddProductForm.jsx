import { useState, useRef } from "react";
import { generateProductDescription } from "../services/ai.api";

const UNITS = ["piece", "kg", "g", "L", "ml", "dozen", "pack", "box", "bottle"];

const EMPTY_FORM = {
  name:          "",
  price:         "",
  discountPrice: "",
  unit:          "piece",
  description:   "",
};

const AddProductForm = ({ onSubmit }) => {
  const [formData, setFormData]   = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState(null);
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError]     = useState(null);
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
      setAiError("Enter a product name first");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    // validate discount < price
    if (formData.discountPrice && Number(formData.discountPrice) >= Number(formData.price)) {
      setError("Discount price must be less than original price");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("name",          formData.name);
      data.append("price",         Number(formData.price));
      data.append("discountPrice", formData.discountPrice ? Number(formData.discountPrice) : "");
      data.append("unit",          formData.unit);
      data.append("description",   formData.description);
      if (imageFile) data.append("image", imageFile);

      await onSubmit(data);

      setFormData(EMPTY_FORM);
      setImageFile(null);
      setPreview(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      <h3 className="text-base font-semibold text-gray-800 mb-4">Add New Product</h3>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}
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
            type="text" name="name" value={formData.name}
            onChange={handleChange} required placeholder="e.g. Basmati Rice"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Price + Unit in one row */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              type="number" name="price" value={formData.price}
              onChange={handleChange} required min="0" placeholder="e.g. 120"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div className="w-28">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              name="unit" value={formData.unit} onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Discount Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Price (₹)
            <span className="text-gray-400 font-normal ml-1">(optional — leave empty for no discount)</span>
          </label>
          <input
            type="number" name="discountPrice" value={formData.discountPrice}
            onChange={handleChange} min="0" placeholder="e.g. 99"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {/* Live discount preview */}
          {formData.discountPrice && formData.price &&
           Number(formData.discountPrice) < Number(formData.price) && (
            <div className="mt-1.5 flex items-center gap-2 text-xs">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:border-blue-400 transition flex items-center justify-center bg-gray-50"
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-2xl mb-1">📷</div>
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

        {/* Description + AI */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <button
              type="button" onClick={handleGenerate}
              disabled={aiLoading || !formData.name.trim()}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {aiLoading ? <><span className="animate-spin">⟳</span> Generating...</> : <>✨ Generate with AI</>}
            </button>
          </div>
          {aiError && <p className="text-xs text-red-500 mb-1">{aiError}</p>}
          {formData.description && !aiLoading && (
            <div className="text-xs text-purple-500 mb-1 flex items-center gap-1">
              <span>✨</span><span>AI generated — you can edit this</span>
            </div>
          )}
          <textarea
            name="description" value={formData.description}
            onChange={handleChange} rows={3}
            placeholder="Brief description or click ✨ Generate with AI..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition duration-200"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>

      </form>
    </div>
  );
};

export default AddProductForm;
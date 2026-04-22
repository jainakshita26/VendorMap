import { useState } from "react";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const DEFAULT_HOURS = DAYS.map((day) => ({
  day,
  open:     "09:00",
  close:    "21:00",
  isClosed: day === "Sunday",
}));

const ShopHoursForm = ({ shop, onSubmit, onClose }) => {
  const [hours, setHours]     = useState(
    shop.hours?.length ? shop.hours : DEFAULT_HOURS
  );
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (index, field, value) => {
    setHours((prev) =>
      prev.map((h, i) => i === index ? { ...h, [field]: value } : h)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit(hours);
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update hours");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">Shop Hours</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-2 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
          ✓ Hours updated successfully
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {hours.map((h, i) => (
          <div key={h.day} className="flex items-center gap-3">

            {/* Day name */}
            <span className="text-sm text-gray-700 w-24 font-medium shrink-0">
              {h.day}
            </span>

            {/* Closed toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={h.isClosed}
                onChange={(e) => handleChange(i, "isClosed", e.target.checked)}
                className="w-4 h-4 accent-red-500"
              />
              <span className="text-xs text-gray-500">Closed</span>
            </label>

            {/* Time inputs — disabled if closed */}
            <div className={`flex items-center gap-2 flex-1 ${h.isClosed ? "opacity-30 pointer-events-none" : ""}`}>
              <input
                type="time"
                value={h.open}
                onChange={(e) => handleChange(i, "open", e.target.value)}
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-400">to</span>
              <input
                type="time"
                value={h.close}
                onChange={(e) => handleChange(i, "close", e.target.value)}
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>
        ))}

        <div className="flex gap-2 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition"
          >
            {loading ? "Saving..." : "Save Hours"}
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

export default ShopHoursForm;
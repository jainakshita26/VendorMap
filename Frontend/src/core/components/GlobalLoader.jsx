// src/core/components/GlobalLoader.jsx
const GlobalLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );
};

export default GlobalLoader;
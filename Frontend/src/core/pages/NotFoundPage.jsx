// src/core/pages/NotFoundPage.jsx
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center space-y-4">

        <p className="text-8xl font-bold text-blue-600">404</p>

        <h1 className="text-2xl font-bold text-gray-800">
          Page not found
        </h1>

        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition duration-200"
        >
          Back to Home
        </button>

      </div>
    </div>
  );
};

export default NotFoundPage;
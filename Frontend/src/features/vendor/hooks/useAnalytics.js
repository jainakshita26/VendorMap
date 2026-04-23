import { useState, useEffect } from "react";
import { getAnalytics } from "../../shop/services/shop.api";

const useAnalytics = (shopExists) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (!shopExists) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [shopExists]);

  return { analytics, loading, error };
};

export default useAnalytics;
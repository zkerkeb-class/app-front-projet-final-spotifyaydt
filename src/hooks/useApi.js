import { useState, useEffect } from 'react';

export function useApi(apiCall, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();

        if (isMounted) {
          // Handle both array and single object responses
          if (Array.isArray(result)) {
            setData(
              result.map((item) => ({
                ...item,
                id: item._id, // Add id for backward compatibility
              }))
            );
          } else if (result && typeof result === 'object') {
            setData({
              ...result,
              id: result._id, // Add id for backward compatibility
            });
          } else {
            setData(result);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}

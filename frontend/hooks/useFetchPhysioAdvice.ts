import { useState, useCallback } from 'react';

export const useFetchPhysioAdvice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = useCallback(async (message: string, adviceType = 'stretches') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        "https://api.example.com/physiotherapy_advice", // Fixed double slash
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            message,
            advice_type: adviceType 
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchAdvice,
    loading,
    error
  };
};

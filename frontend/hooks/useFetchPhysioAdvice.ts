import { useState, useCallback } from "react";
import Constants from "expo-constants";

const PHYSIO_ADVICE_API_URL =
  Constants.expoConfig?.extra?.physioAdviceUrl ?? "http://localhost:8000";

export const useFetchPhysioAdvice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = useCallback(
    async (message: string, adviceType = "stretches", useRag = true) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${PHYSIO_ADVICE_API_URL}/physiotherapy_advice`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message,
              advice_type: adviceType,
              use_rag: useRag,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err: any) {
        console.warn("PHYSIO_ADVICE_API_URL:", PHYSIO_ADVICE_API_URL);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    fetchAdvice,
    loading,
    error,
  };
};

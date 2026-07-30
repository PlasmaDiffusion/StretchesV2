import { useState, useCallback, useRef } from "react"

const PHYSIO_ADVICE_API_URL = process.env.EXPO_PUBLIC_PHYSIO_ADVICE_API_URL ?? "http://localhost:8000";

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export const useFetchPhysioAdvice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = useCallback(
    async (
      message: string,
      adviceType = "stretches",
      useRag = true,
      conversationHistory?: ConversationTurn[]
    ) => {
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
              ...(conversationHistory?.length ? { conversation_history: conversationHistory } : {}),
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


export type StreamStatus =
  | "validating_request"
  | "fetching_rag_context"
  | "rag_context_failed"
  | "calling_openai"
  | "done"
  | "error";

export const useStreamPhysioAdvice = (onStatusChange?: (status: StreamStatus) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAdviceStream = useCallback(
    async (
      message: string,
      adviceType = "stretches",
      useRag = true,
      conversationHistory?: ConversationTurn[]
    ) => {
      setLoading(true);
      setError(null);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const response = await fetch(
          `${PHYSIO_ADVICE_API_URL}/physiotherapy_advice_stream`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message,
              advice_type: adviceType,
              use_rag: useRag,
              ...(conversationHistory?.length ? { conversation_history: conversationHistory } : {}),
            }),
            signal: abortController.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        if (!reader) {
          throw new Error("No response body");
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                const status = data.status as StreamStatus;

                onStatusChange?.(status);

                if (status === "done") {
                  setLoading(false);
                  return data.result;
                } else if (status === "error") {
                  const errorMsg = data.message || "Unknown error";
                  setError(errorMsg);
                  setLoading(false);
                  throw new Error(errorMsg);
                }
              } catch (err) {
                if (err instanceof Error && !err.message.includes("Unknown error")) {
                  console.error("Error parsing stream data:", err);
                }
              }
            }
          }
        }

        setLoading(false);
        return null;
      } catch (err: any) {
        if (err.name === "AbortError") {
          setLoading(false);
          return null;
        }
        console.warn("PHYSIO_ADVICE_API_URL:", PHYSIO_ADVICE_API_URL);
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    [onStatusChange]
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }
  }, []);

  return {
    fetchAdviceStream,
    loading,
    error,
    cancel,
  };
};

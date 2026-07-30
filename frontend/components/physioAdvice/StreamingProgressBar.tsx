import React from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { StreamStatus } from "../../hooks/useFetchPhysioAdvice";

interface Props {
  status: StreamStatus | null;
  error: string | null;
  onCancel?: () => void;
  isLoading: boolean;
}

const statusMessages: Record<StreamStatus, string> = {
  validating_request: "Validating request...",
  fetching_rag_context: "Fetching medical context...",
  rag_context_failed: "Proceeding without context...",
  calling_openai: "Getting AI response...",
  done: "Done!",
  error: "Error occurred",
};

const getProgressPercentage = (status: StreamStatus | null): number => {
  switch (status) {
    case "validating_request":
      return 15;
    case "fetching_rag_context":
      return 30;
    case "rag_context_failed":
      return 40;
    case "calling_openai":
      return 75;
    case "done":
      return 100;
    default:
      return 0;
  }
};

export function StreamingProgressBar({
  status,
  error,
  onCancel,
  isLoading,
}: Props) {
  if (!isLoading && !error) {
    return null;
  }

  const progress = getProgressPercentage(status);
  const message = error ? "Error" : statusMessages[status || "validating_request"];

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
              backgroundColor: error ? "#ff3b30" : "#34C759",
            },
          ]}
        />
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.textContainer}>
          {isLoading && <ActivityIndicator size="small" color="#007AFF" />}
          <Text
            style={[
              styles.statusText,
              { color: error ? "#ff3b30" : "#007AFF" },
            ]}
          >
            {message}
          </Text>
        </View>

        {isLoading && onCancel && (
          <Pressable onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        )}
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 16,
  },
  progressContainer: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ff3b30",
    borderRadius: 4,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 8,
    fontWeight: "500",
  },
});

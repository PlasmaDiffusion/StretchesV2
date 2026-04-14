import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFetchPhysioAdvice } from "../../hooks/useFetchPhysioAdvice";
import PhysioAdviceCategory from "./PhysioAdviceCategory";
import { HeadingText } from "../commonComponents/HeadingText";
import { saveAdviceSession, generateTitleFromPrompt } from "../../utilities/adviceStorage";

type AdviceType = "stretches" | "mental" | "misc_physiotherapy";

interface PhysioAdviceResponse {
  message: string;
  extra_data: string;
}

export default function PhysioAdviceScreen() {
  const { fetchAdvice, loading, error } = useFetchPhysioAdvice();
  const [advice, setAdvice] = useState<PhysioAdviceResponse | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [adviceType, setAdviceType] = useState<AdviceType>("stretches");
  const [useRag, setUseRag] = useState(true);

  const handleGetAdvice = useCallback(async () => {
    if (!inputMessage.trim()) return;

    try {
      const advice: PhysioAdviceResponse = await fetchAdvice(
        inputMessage,
        adviceType,
        useRag
      );
      setAdvice(advice);
      await saveAdviceSession({
        title: generateTitleFromPrompt(inputMessage),
        advice: [{ message: advice.message, extra_data: advice.extra_data }],
      });
    } catch (err) {
      console.error("Failed:", err);
    }
  }, [fetchAdvice, inputMessage, adviceType, useRag]);

  return (
    <View style={styles.container}>
      <HeadingText>Physiotherapy Advice</HeadingText>

      {error && <Text style={styles.error}>Error: {error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Describe your pain or concern..."
        value={inputMessage}
        onChangeText={setInputMessage}
        multiline
        numberOfLines={3}
      />

      <Text>Select what type of advice you'd like:</Text>
      <PhysioAdviceCategory
        adviceType={adviceType}
        onAdviceTypeChange={setAdviceType}
      />

      <View style={styles.ragToggleRow}>
        <Switch value={useRag} onValueChange={setUseRag} />
        <Text style={styles.ragToggleLabel}>
          Use physiotherapy research articles
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!inputMessage.trim() || loading) && styles.disabledButton,
        ]}
        onPress={handleGetAdvice}
        disabled={!inputMessage.trim() || loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Loading..." : "Get Advice"}
        </Text>
      </TouchableOpacity>

      {advice && (
        <>
          <View style={styles.adviceContainer}>
            <Text style={styles.adviceText}>{advice.message}</Text>
          </View>

          <View style={[styles.extraDataContainer, styles.adviceContainer]}>
            <Text style={styles.adviceText}>{advice.extra_data}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  adviceContainer: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  extraDataContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  adviceText: {
    lineHeight: 20,
  },
  ragToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  ragToggleLabel: {
    color: "#333",
    fontSize: 14,
  },
});

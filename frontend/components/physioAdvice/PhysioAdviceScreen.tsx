import React, { useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFetchPhysioAdvice } from "../../hooks/useFetchPhysioAdvice";
import PhysioAdviceCategory from "./PhysioAdviceCategory";
import { HeadingText } from "../commonComponents/HeadingText";

type AdviceType = "stretches" | "mental" | "misc_physiotherapy";

export default function PhysioAdviceScreen() {
  const { fetchAdvice, loading, error } = useFetchPhysioAdvice();
  const [advice, setAdvice] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [adviceType, setAdviceType] = useState<AdviceType>("stretches");

  const handleGetAdvice = useCallback(async () => {
    if (!message.trim()) return;
    
    try {
      const advice = await fetchAdvice(message, adviceType);
      setAdvice(advice);
    } catch (err) {
      console.error("Failed:", err);
    }
  }, [fetchAdvice, message, adviceType]);

  return (
    <View style={styles.container}>
      <HeadingText>Physiotherapy Advice</HeadingText>

      {error && <Text style={styles.error}>Error: {error}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Describe your pain or concern..."
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={3}
      />

      <PhysioAdviceCategory 
        adviceType={adviceType}
        onAdviceTypeChange={setAdviceType}
      />

      <TouchableOpacity 
        style={[styles.submitButton, (!message.trim() || loading) && styles.disabledButton]}
        onPress={handleGetAdvice} 
        disabled={!message.trim() || loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Loading..." : "Get Advice"}
        </Text>
      </TouchableOpacity>

      {advice && (
        <View style={styles.adviceContainer}>
          <Text style={styles.adviceText}>{advice}</Text>
        </View>
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
  adviceText: {
    lineHeight: 20,
  },
});

import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

type AdviceType = "stretches" | "mental" | "misc_physiotherapy";

interface PhysioAdviceCategoryProps {
  adviceType: AdviceType;
  onAdviceTypeChange: (type: AdviceType) => void;
}

export default function PhysioAdviceCategory({ 
  adviceType, 
  onAdviceTypeChange 
}: PhysioAdviceCategoryProps) {
  return (
    <View style={styles.buttonGroup}>
      <TouchableOpacity
        style={[styles.typeButton, adviceType === "stretches" && styles.activeButton]}
        onPress={() => onAdviceTypeChange("stretches")}
      >
        <Text style={[styles.buttonText, adviceType === "stretches" && styles.activeButtonText]}>
          Stretches
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.typeButton, adviceType === "mental" && styles.activeButton]}
        onPress={() => onAdviceTypeChange("mental")}
      >
        <Text style={[styles.buttonText, adviceType === "mental" && styles.activeButtonText]}>
          Mental
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.typeButton, adviceType === "misc_physiotherapy" && styles.activeButton]}
        onPress={() => onAdviceTypeChange("misc_physiotherapy")}
      >
        <Text style={[styles.buttonText, adviceType === "misc_physiotherapy" && styles.activeButtonText]}>
          Other
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  activeButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  buttonText: {
    textAlign: "center",
    color: "#333",
  },
  activeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
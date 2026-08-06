import React, { useState } from "react";
import { View, Switch, Text, StyleSheet, TouchableOpacity } from "react-native";
import PhysioAdviceCategory from "./PhysioAdviceCategory";

type AdviceType = "stretches" | "mental" | "misc_physiotherapy";

interface PhysioAdviceQuestionSettingsProps {
  adviceType: AdviceType;
  onAdviceTypeChange: (type: AdviceType) => void;
  useRag: boolean;
  onRagChange: (use: boolean) => void;
}

export default function PhysioAdviceQuestionSettings({
  adviceType,
  onAdviceTypeChange,
  useRag,
  onRagChange,
}: PhysioAdviceQuestionSettingsProps) {
  const [settingsVisible, setSettingsVisible] = useState(false);

  if (!settingsVisible) {
    return (
      <TouchableOpacity
        onPress={() => setSettingsVisible(true)}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleButtonText}>+ Show Extra Settings</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View>

      <View style={styles.row}>
      <TouchableOpacity
        onPress={() => setSettingsVisible(false)}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleButtonText}>−</Text>
      </TouchableOpacity>

      <PhysioAdviceCategory
        adviceType={adviceType}
        onAdviceTypeChange={onAdviceTypeChange}
      />
      </View>

      <View style={styles.ragToggleRow}>
        <Switch value={useRag} onValueChange={onRagChange} />
        <Text style={styles.ragToggleLabel}>
          Use research articles to support answers
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    paddingVertical: 8,
    marginBottom: 10,
  },
  toggleButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  ragToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  ragToggleLabel: {
    color: "#555",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
  }
});

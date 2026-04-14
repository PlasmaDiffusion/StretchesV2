import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HeadingText } from "../commonComponents/HeadingText";

interface PhysioAdviceSummaryProps {
  extra_data: string;
}

function formatKey(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function renderValue(value: unknown): React.ReactNode {
  if (Array.isArray(value)) {
    return (
      <View style={styles.listContainer}>
        {value.map((item, index) => (
          <Text key={index} style={styles.listItem}>
            • {String(item)}
          </Text>
        ))}
      </View>
    );
  }
  if (value === null || value === undefined) {
    return <Text style={styles.value}>—</Text>;
  }
  return <Text style={styles.value}>{String(value)}</Text>;
}

export default function PhysioAdviceSummary({ extra_data }: PhysioAdviceSummaryProps) {
  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(extra_data);
  } catch {
    return <Text style={styles.value}>{extra_data}</Text>;
  }

  return (
    <View>
      <HeadingText size="small" verticalSpacing={8}>Summary</HeadingText>
      {Object.entries(parsed).map(([key, value], index) => (
        <View key={key} style={[styles.row, index > 0 && styles.rowSpacing]}>
          <Text style={styles.label}>{formatKey(key)}</Text>
          {renderValue(value)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 4,
  },
  rowSpacing: {
    marginTop: 12,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    color: "#333",
    lineHeight: 20,
  },
  listContainer: {
    gap: 4,
  },
  listItem: {
    color: "#333",
    lineHeight: 20,
  },
});

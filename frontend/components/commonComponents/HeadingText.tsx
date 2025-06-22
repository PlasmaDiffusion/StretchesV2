import React from "react";
import { Text, StyleSheet } from "react-native";

interface Props {
  children: string;
  size?: "small" | "large";
  verticalSpacing?: 0 | 8 | 16;
}

export function HeadingText({
  children,
  size = "large",
  verticalSpacing,
}: Props) {
  const fontSize = size === "large" ? 30 : 20;
  return (
    <Text
      style={[
        styles.heading,
        { fontSize },
        { marginVertical: verticalSpacing },
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  dateDropdown: {
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 8,
  },
  heading: {
    textAlign: "center",
  },
});

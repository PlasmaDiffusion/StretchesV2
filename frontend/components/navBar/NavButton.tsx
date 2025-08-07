import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
  text: string;
  isCurrentView?: boolean;
  icon?: string;
  onPress: () => void;
}

function NavButton({ text, isCurrentView, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 10 }}>
      <Text
        style={isCurrentView ? styles.buttonTextCurrent : styles.buttonText}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default NavButton;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  buttonText: {
    color: "#AAAAFF",
    fontSize: 16,
  },
  buttonTextCurrent: {
    color: "#AAAAFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

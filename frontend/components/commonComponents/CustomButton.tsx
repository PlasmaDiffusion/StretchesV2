import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  text: string;
  icon?: string;
  onPress: () => void;
  color?: string;
}

export function PrimaryButton({ text, onPress, color = "#aaaaee" }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        ...styles.button,
        ...styles.primaryButton,
      }}
    >
      <Text style={{ textAlign: "center" }}>{text}</Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({ text, onPress, color = "#aa00ff" }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderColor: color,
        ...styles.button,
        ...styles.secondaryButton,
      }}
    >
      <Text style={{ color: color, textAlign: "center" }}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 10, marginVertical: 8, marginHorizontal: 4 },
  text: {fontSize: 24, textAlign: "center"},
  primaryButton: {
    borderRadius: 5,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 5,
  },
});

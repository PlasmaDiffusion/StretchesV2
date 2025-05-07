import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  text: string;
  icon?: string;
  onPress: () => void;
  color?: string;
}

export function PrimaryButton({ text, onPress, color = "crimson" }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: color, padding: 10, borderRadius: 5 }}
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({ text, onPress, color = "#aa00ff" }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderColor: color,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Text style={{color: color}}>{text}</Text>
    </TouchableOpacity>
  );
}

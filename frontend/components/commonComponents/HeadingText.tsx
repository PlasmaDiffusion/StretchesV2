import { Text, StyleSheet } from "react-native";

interface Props {
  children: string;
}

export function HeadingText({ children }: Props) {
  return <Text style={styles.heading}>{children}</Text>;
}

const styles = StyleSheet.create({
  dateDropdown: {
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 8,
  },
  heading: {
    fontSize: 30,
    textAlign: 'center'
  },
});

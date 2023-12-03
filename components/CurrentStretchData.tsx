import Slider from "react-native-a11y-slider";
import { Text, StyleSheet, View } from "react-native";
import { Stretch } from "../App";

interface Props {
  stretch: Stretch;
  time: number;
}

export function CurrentStretchData({ stretch, time }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.name, { color: stretch.color }]}>
        {stretch.name}
      </Text>
      {/* Dummy slider used as timer */}
      <Slider
        min={0}
        max={stretch.totalStretchTime}
        values={[(time / stretch.totalStretchTime) * 100]}
        increment={1}
        labelStyle={{ marginTop: 15 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    margin: 64,
  },
  name: {
    fontSize: 24,
    textAlign: "center",
  },
  slider: {
    width: "50%",
    height: "150%",
  },
});

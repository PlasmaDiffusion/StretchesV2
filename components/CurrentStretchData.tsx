import Slider from "react-native-a11y-slider";
import { Text, StyleSheet, View, Button, DimensionValue } from "react-native";
import { Stretch } from "../App";
import { useEffect, useState } from "react";

interface Props {
  stretch: Stretch;
  time: number;
}

export function CurrentStretchData({ stretch, time }: Props) {
  const [stretchPercentage, setStretchPercentage] =
    useState<DimensionValue>("100%");

  useEffect(() => {
    setStretchPercentage(`${(time / stretch.totalStretchTime) * 100}%`);
  }, [stretch, time]);

  return (
    <View style={styles.container}>
      <Text style={[styles.name, { color: stretch.color }]}>
        {stretch.name}
      </Text>
      <Text style={styles.name}>{time}</Text>
      <Text
        style={[
          { width: stretchPercentage, backgroundColor: stretch.color },
          styles.timerBar,
        ]}
      ></Text>
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
  timerBar: {
    maxHeight: "5%",
  },
});

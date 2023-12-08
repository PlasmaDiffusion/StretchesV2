import {
  Text,
  StyleSheet,
  View,
  DimensionValue,
  TouchableOpacity,
  Linking,
} from "react-native";
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

      {stretch.links && (
        <View style={styles.linkContainer}>
          {stretch.links.map((link, index) => (
            <TouchableOpacity
              onPress={async () => {
                if (await Linking.canOpenURL(link)) {
                  await Linking.openURL(link);
                }
              }}
            >
              <Text style={styles.link}>
                Reference {index > 0 && index + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
  linkContainer: {
    marginTop: 32,
  },
  link: {
    fontSize: 24,
    color: "light-blue",
    textDecorationLine: "underline",
  },
});

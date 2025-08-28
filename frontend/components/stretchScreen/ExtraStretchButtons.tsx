import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { Stretch } from "../../interfaces/stretchList";

const MAX_TIME_PER_STRETCH = 240;
const MIN_TIME_PER_STRETCH_ABOVE_ZERO = 30;

interface Props {
  stretches: Stretch[];
  setStretches: (stretches: Stretch[]) => void;
  buttonEnablesAll: boolean;
  setButtonEnablesAll: (val: boolean) => void;
  maxTimePerStretch: number;
  minTimePerStretchAboveZero: number;
}

export function ExtraStretchButtons({
  stretches,
  setStretches,
  buttonEnablesAll,
  setButtonEnablesAll,
  maxTimePerStretch,
  minTimePerStretchAboveZero,
}: Props) {
  return (
    <>
      <View style={styles.container}>
        <Button
          title={buttonEnablesAll ? "Enable All" : "Disable All"}
          onPress={() => {
            const stretchCopy = [...stretches];
            stretchCopy.forEach((stretch) => {
              stretch.enabled = buttonEnablesAll;
            });
            setStretches([...stretchCopy]);
            setButtonEnablesAll(!buttonEnablesAll);
          }}
        />
        <Button
          title="½ Times"
          onPress={() => {
            const stretchCopy = stretches.map((stretch) =>
              stretch.enabled
                ? {
                    ...stretch,
                    totalStretchTime: Math.max(
                      minTimePerStretchAboveZero,
                      Math.floor(stretch.totalStretchTime / 2)
                    ),
                  }
                : stretch
            );
            setStretches(stretchCopy);
          }}
        />
        <Button
          title="×2 Times"
          onPress={() => {
            const stretchCopy = stretches.map((stretch) =>
              stretch.enabled
                ? {
                    ...stretch,
                    totalStretchTime: Math.min(
                      stretch.totalStretchTime * 2,
                      maxTimePerStretch
                    ),
                  }
                : stretch
            );
            setStretches(stretchCopy);
          }}
        />
      </View>

      <Text style={styles.totalTimeText}>
        Total time of selected stretches:{"\n"}
        {stretches
          .filter((stretch) => stretch.enabled)
          .reduce((sum, stretch) => sum + (stretch.totalStretchTime/60), 0)}
        {" minutes"}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    textAlign: "center",
    alignSelf: "center",
    marginVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  totalTimeText: {
    marginVertical: 16,
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    paddingBottom: 32,
  },
});

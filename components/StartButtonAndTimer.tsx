import { useCallback, useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { Stretch } from "../App";

interface Props {
  currentStretch: Stretch | undefined;
  currentTime: number;
  incrementTime: () => void;
  goToNextStretch: () => void;
}

export function StartButtonAndTimer({
  currentStretch,
  currentTime,
  incrementTime,
  goToNextStretch,
}: Props) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    console.log("*intervalStarted");
    const interval = setInterval(() => {
      console.log("*interval", currentStretch, paused, currentTime);
      if (!paused && currentStretch) {
        if (currentTime === 0) {
          setPaused(true);
          goToNextStretch();
        } else {
          incrementTime();
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [currentStretch, currentTime, paused]);

  function getButtonPauseText() {
    return paused ? "Unpause" : "Pause";
  }

  return (
    <View style={styles.buttonContainer}>
      <Button
        onPress={() => {
          setPaused(!paused);
          if (!currentStretch || currentTime === 0) {
            goToNextStretch();
          }
        }}
        title={currentStretch ? getButtonPauseText() : "Start"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 200,
  },
});

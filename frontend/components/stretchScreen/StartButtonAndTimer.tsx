import { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { Stretch } from "../../interfaces/stretchList";
import React from "react";
import { useNavBarStore } from "../../stores/navBarStore";

interface Props {
  currentStretch: Stretch | undefined;
  currentTime: number;
  started: boolean;
  incrementTime: () => void;
  goToNextStretch: () => void;
}

export function StartButtonAndTimer({
  currentStretch,
  currentTime,
  incrementTime,
  goToNextStretch,
  started,
}: Props) {
  const [paused, setPaused] = useState(true);
  const setShowNavBar = useNavBarStore((state) => state.setShowNavBar);

  useEffect(() => {
    if (started) {
      const interval = setInterval(() => {
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
    }
  }, [started, currentStretch, currentTime, paused]);

  function getButtonPauseText() {
    return paused ? "Unpause" : "Pause";
  }

  return (
    <View style={styles.buttonContainer}>
      <Button
        onPress={() => {
          setShowNavBar(false);
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

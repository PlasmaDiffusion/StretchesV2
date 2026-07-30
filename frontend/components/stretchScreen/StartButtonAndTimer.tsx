import { useEffect, useState } from "react";
import { Button, StyleSheet, View, Alert } from "react-native";
import { Stretch } from "../../interfaces/stretchList";
import React from "react";
import { useNavBarStore } from "../../stores/navBarStore";

interface Props {
  currentStretch: Stretch | undefined;
  currentTime: number;
  started: boolean;
  incrementTime: () => void;
  goToNextStretch: () => void;
  skipStretch: () => void;
}

export function StartButtonAndTimer({
  currentStretch,
  currentTime,
  incrementTime,
  goToNextStretch,
  skipStretch,
  started,
}: Props) {
  const [paused, setPaused] = useState(true);
  const setShowNavBar = useNavBarStore((state) => state.setShowNavBar);

  function handleSkip() {
    Alert.alert(
      "Skip Stretch?",
      "Are you sure you want to skip? This time won't be logged.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Skip",
          style: "destructive",
          onPress: () => {
            skipStretch();
            setPaused(true);
          },
        },
      ]
    );
  }

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
  }, [started, currentStretch, currentTime, paused, goToNextStretch, incrementTime]);

  function getButtonPauseText() {
    return paused ? "Unpause" : "Pause";
  }

  return (
    <View style={[styles.buttonContainer, { marginBottom: started ? 128 : 0 }]}>
      <Button
        onPress={() => {
          setShowNavBar(false);
          if (!currentStretch || currentTime === 0) {
            setPaused(false);
            goToNextStretch();
          } else {
            setPaused(!paused);
          }
        }}
        title={currentStretch ? getButtonPauseText() : "Start"}
      />
      {paused && currentStretch && currentTime > 0 && (
        <View style={styles.skipButton}>
          <Button title="Skip" onPress={handleSkip} color="#ff3b30" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 100,
    alignSelf: "center",
  },
  skipButton: {
    marginTop: 8,
  },
});

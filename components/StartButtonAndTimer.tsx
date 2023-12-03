import { useEffect, useState } from "react";
import { Button } from "react-native";
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
    if (!paused) {
      setInterval(() => {
        if (!paused && currentStretch) {
          incrementTime();
          if (currentTime >= currentStretch.totalStretchTime) {
            setPaused(true);
          }
        }
      }, 1000);
    }
  }, [paused, currentTime]);

  return (
    <>
      <Button
        onPress={() => {
          setPaused(!paused);
          if (
            !currentStretch ||
            currentTime >= currentStretch.totalStretchTime
          ) {
            goToNextStretch();
          }
        }}
        title="Start"
      />
    </>
  );
}

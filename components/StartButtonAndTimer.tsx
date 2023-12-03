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
    setInterval(() => {
      if (!paused && currentStretch) {
        if (currentTime === 0) {
          setPaused(true);
          goToNextStretch();
        } else {
          incrementTime();
        }
      }
    }, 1000);
  }, []);

  return (
    <>
      <Button
        onPress={() => {
          setPaused(!paused);
          if (!currentStretch || currentTime === 0) {
            goToNextStretch();
          }
        }}
        title="Start"
      />
    </>
  );
}

import React from "react";
import { Text } from "react-native";

interface Props {
  seconds: number;
}

export function TimeOutput({ seconds }: Props) {
  if (seconds >= 3600) { // 1 hour
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const onlyOneHour = hours === 1;
    const onlyOneMinute = minutes === 1;
    const onlyOneSecond = secs === 1;
    return (
      <Text>
        {hours} hour{!onlyOneHour ? "s" : ""}
        {minutes > 0 && `, ${minutes} minute${!onlyOneMinute ? "s" : ""}`}
        {secs > 0 && `, ${secs} second${!onlyOneSecond ? "s" : ""}`}
      </Text>
    );
  }
  if (seconds >= 60) { // 1 minute
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const onlyOneMinute = minutes === 1;
    const onlyOneSecond = secs === 1;
    return (
      <Text>
        {minutes} minute{!onlyOneMinute ? "s" : ""}
        {secs > 0 && `, ${secs} second${!onlyOneSecond ? "s" : ""}`}
      </Text>
    );
  }
  // Less than a minute
  const onlyOneSecond = seconds === 1;
  return (
    <Text>
      {seconds} second{!onlyOneSecond ? "s" : ""}
    </Text>
  );
}

import {
  Text,
  StyleSheet,
  View,
  DimensionValue,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useEffect, useState } from "react";
import { ExerciseLog } from "../../interfaces/exerciseLog";

interface Props {
  exerciseLogsForDay: ExerciseLog[];
  numberedDay: string;
  month: number;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const daySuffixes = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  if (day % 10 === 1 && day !== 11) return "st";
  if (day % 10 === 2 && day !== 12) return "nd";
  if (day % 10 === 3 && day !== 13) return "rd";
  return "th";
});

function ExerciseDailyLog({ numberedDay, month, exerciseLogsForDay }: Props) {
  return (
    <View>
      {exerciseLogsForDay.map((log, index) => (
        <View key={index} style={styles.logContainer}>
          <Text>
            {months[month]} {numberedDay}
            {daySuffixes[parseInt(numberedDay)]}
          </Text>
          <Text style={styles.logText}>{log.stretch}</Text>
          <Text style={styles.logText}>
            {log.secondsSpentDoingStretch} seconds
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  logContainer: { borderWidth: 1, borderColor: "black", padding: 10 },
  logText: {},
});

export default ExerciseDailyLog;

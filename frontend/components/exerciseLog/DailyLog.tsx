import { Text, StyleSheet, View } from "react-native";
import { ExerciseLog, HealthLog } from "../../interfaces/exerciseLog";
import { useState } from "react";
import { PrimaryButton } from "../commonComponents/CustomButton";
import DailyHealthLog from "./painAndMentalHealthLogs/DailyHealthLog";
import React from "react";
import { TimeOutput } from "./TimeOutput";

interface Props {
  exercises: ExerciseLog[];
  dayKey: string;
  month: number;
  healthLog?: HealthLog;
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

/** Shows exercise, pain, and mental health records for the day. Also lets you set and save pain & mental health records  */
function DailyLog({ dayKey, month, exercises, healthLog }: Props) {
  const [showExercises, setShowExercises] = useState(false);

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.bold}>
        {months[month]} {dayKey}
        {daySuffixes[parseInt(dayKey) - 1]}
      </Text>

      <DailyHealthLog healthLog={healthLog} dayKey={dayKey} />

      <Text style={styles.heading}>Exercises ({exercises.length})</Text>
      <PrimaryButton
        text={showExercises ? "Hide" : "Show"}
        onPress={() => {
          setShowExercises(!showExercises);
        }}
        color="#00aaff"
      />
      {showExercises &&
        exercises.map((log, index) => (
          <View key={index} style={styles.innerContainer}>
            <Text style={{ color: log.color, ...styles.logText }}>
              {log.stretch}
            </Text>
              <TimeOutput seconds={log.secondsSpentDoingStretch} />
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    borderStyle: "dotted",
    backgroundColor: "white",
    padding: 5,
  },
  outerContainer: {
    backgroundColor: "#11ddff",
    borderRadius: 4,
    padding: 5,
    marginVertical: 5,
  },
  bold: { fontWeight: "bold" },
  logText: {},
  heading: { marginVertical: 5 },
  rowOfButtons: { display: "flex", flexDirection: "row" },
});

export default DailyLog;

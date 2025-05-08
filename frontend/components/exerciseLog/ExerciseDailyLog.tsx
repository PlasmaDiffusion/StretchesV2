import { Text, StyleSheet, View } from "react-native";
import { ExerciseLog } from "../../interfaces/exerciseLog";
import IntensityPicker from "./painAndMentalHealthLogs/IntensityPicker";
import { useState } from "react";
import { PrimaryButton } from "../commonComponents/CustomButton";

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
  const [showExercises, setShowExercises] = useState(false);

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.bold}>
        {months[month]} {numberedDay}
        {daySuffixes[parseInt(numberedDay) - 1]}
      </Text>

      <Text style={styles.heading}>Pain</Text>
      <View style={styles.innerContainer}>
        <IntensityPicker
          type="Pain"
          pickedValue={0}
          setPickedValue={() => {}}
        />
      </View>
      <Text style={styles.heading}>Mental Health</Text>
      <View style={styles.innerContainer}>
        <IntensityPicker
          type="Mental Health"
          pickedValue={3}
          setPickedValue={() => {}}
        />
      </View>
      <Text style={styles.heading}>Exercises ({exerciseLogsForDay.length})</Text>
      <PrimaryButton
        text={showExercises ? "Hide" : "Show"}
        onPress={() => {
          setShowExercises(!showExercises);
        }}
        color="#00aaff"
      />
      {showExercises && exerciseLogsForDay.map((log, index) => (
        <View key={index} style={styles.innerContainer}>
          <Text style={{ color: log.color, ...styles.logText }}>
            {log.stretch}
          </Text>
          <Text style={styles.logText}>
            {log.secondsSpentDoingStretch} seconds
          </Text>
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
});

export default ExerciseDailyLog;

import { Text, StyleSheet, View } from "react-native";
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
    <View style={styles.outerContainer}>
      <Text>
        {months[month]} {numberedDay}
        {daySuffixes[parseInt(numberedDay) - 1]}
      </Text>
      <Text>Exercises</Text>
      {exerciseLogsForDay.map((log, index) => (
        <View key={index} style={styles.innerContainer}>
          <Text style={styles.logText}>{log.stretch}</Text>
          <Text style={styles.logText}>
            {log.secondsSpentDoingStretch} seconds
          </Text>
        </View>
      ))}
      <Text>Pain</Text>
      <View style={styles.innerContainer}>
        <Text>s</Text>
      </View>
      <Text>Mental Health</Text>
      <View style={styles.innerContainer}>
        <Text>s</Text>
      </View>
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
    backgroundColor: "orange",
    borderRadius: 4,
    padding: 5,
  },

  logText: {},
});

export default ExerciseDailyLog;

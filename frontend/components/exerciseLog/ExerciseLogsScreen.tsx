import { Text, StyleSheet, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import storage from "../../utilities/storage";
import { ExerciseLog, HealthLog } from "../../interfaces/exerciseLog";
import { Dropdown } from "react-native-element-dropdown";
import DailyLog from "./DailyLog";
import { HeadingText } from "../commonComponents/HeadingText";

const yearDropdownData = [
  { label: "2025", value: 2025 },
  { label: "2026", value: 2026 },
  { label: "2027", value: 2027 },
  { label: "2028", value: 2028 },
  { label: "2029", value: 2029 },
  { label: "2030", value: 2030 },
];

const monthDropdownData = [
  { label: "January", value: 0 },
  { label: "February", value: 1 },
  { label: "March", value: 2 },
  { label: "April", value: 3 },
  { label: "May", value: 4 },
  { label: "June", value: 5 },
  { label: "July", value: 6 },
  { label: "August", value: 7 },
  { label: "September", value: 8 },
  { label: "October", value: 9 },
  { label: "November", value: 10 },
  { label: "December", value: 11 },
];

/** Load in logs of exercises and display them for the current month */
function ExerciseLogsScreen() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  //Maps of logs for the current month, with a key for the day of the month

  //ExerciseLog[] is an array since there can be multiple exercises a day
  const [exerciseLogs, setExerciseLogs] =
    useState<Map<string, ExerciseLog[]>>();

  //HealthLog on the other hand is only about how you feel in general during that day
  const [healthLogs, setHealthLogs] = useState<Map<string, HealthLog>>();

  const loadLogsForMonth = useCallback(() => {
    const loadExerciseLog = async () => {
      await storage
        .load({
          key: `exerciseLog-${month}-${year}`,
          autoSync: true,
          syncInBackground: true,
        })
        .then((ret) => {
          const exerciseLogsMap = new Map<string, ExerciseLog[]>(
            Object.entries(ret.logs)
          );
          setExerciseLogs(exerciseLogsMap);
          console.log(exerciseLogsMap);
          setLoading(false);
        })
        .catch((error: Error) => {
          console.warn(error.message);
          setLoading(false);
          setExerciseLogs(undefined);
          setNotFound(true);
        });
    };

    const loadHealthLog = async () => {
      await storage
        .load({
          key: `healthLog-${month}-${year}`,
          autoSync: true,
          syncInBackground: true,
        })
        .then((ret) => {
          console.log("ret healthLog", ret);
          const healthLogsMap = new Map<string, HealthLog>(
            Object.entries(ret.logs)
          );
          setHealthLogs(healthLogsMap);
          console.log("health logs", healthLogsMap);
        })
        .catch((error: Error) => {
          console.warn(error.message);
          setHealthLogs(undefined);
        });
    };

    setLoading(true);
    setExerciseLogs(undefined);
    setHealthLogs(undefined);

    setNotFound(false);
    loadExerciseLog();
    loadHealthLog();
  }, [loading, month, year]);

  useEffect(() => {
    loadLogsForMonth();
  }, []);

  return (
    <>
      <HeadingText>Daily Log</HeadingText>
      <Dropdown
        onChange={(item) => {
          setYear(item.value);
          loadLogsForMonth();
        }}
        style={styles.dateDropdown}
        data={yearDropdownData}
        labelField={"label"}
        valueField={"value"}
        placeholder="Select Year"
        value={year}
      />
      <Dropdown
        onChange={(item) => {
          setMonth(item.value);
          loadLogsForMonth();
        }}
        style={styles.dateDropdown}
        data={monthDropdownData}
        labelField={"label"}
        valueField={"value"}
        placeholder="Select Month"
        value={month}
      />
      {loading && <Text>Loading...</Text>}
      {notFound && <Text>No logs found for this month.</Text>}
      {exerciseLogs &&
        Array.from(exerciseLogs.entries()).map(([key, logs]) => (
          <View key={key}>
            <DailyLog
              exercises={logs}
              dayKey={key}
              month={month}
              healthLog={
                healthLogs && healthLogs.get(key)
                  ? healthLogs.get(key)
                  : undefined
              }
            />
          </View>
        ))}
    </>
  );
}

const styles = StyleSheet.create({
  dateDropdown: {
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 8,
  },
});

export default ExerciseLogsScreen;

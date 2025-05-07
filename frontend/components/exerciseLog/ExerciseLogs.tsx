import { Text, StyleSheet } from "react-native";
import { useCallback, useState } from "react";
import storage from "../../utilities/storage";
import { ExerciseLog } from "../../interfaces/exerciseLog";
import { Dropdown } from "react-native-element-dropdown";
import {
  PrimaryButton,
  SecondaryButton,
} from "../commonComponents/CustomButton";

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
function ExerciseLogs() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  //Exercise logs for current month
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);

  const loadLogsForMonth = useCallback(() => {
    const loadExerciseLog = async () => {
      const loadedLogs = await storage
        .load({
          key: `exerciseLog-${month}-${year}`,
          autoSync: true,
          syncInBackground: true,
        })
        .then((ret) => {
          console.log(ret.logs);
          setExerciseLogs(ret.logs);
          setLoading(false);
        })
        .catch((error: Error) => {
          console.warn(error.message);
          setLoading(false);
          setNotFound(true);
        });
    };
    setNotFound(false);
    loadExerciseLog();
  }, [loading, month, year]);

  return (
    <>
      <Dropdown
        onChange={(item) => {
          setYear(item.value);
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
        }}
        style={styles.dateDropdown}
        data={monthDropdownData}
        labelField={"label"}
        valueField={"value"}
        placeholder="Select Month"
        value={month}
      />

      <PrimaryButton
        onPress={async () => {
          setLoading(true);
          loadLogsForMonth();
        }}
        text="Show Monthly Logs"
      />

      <SecondaryButton
        onPress={async () => {
          setLoading(true);
          loadLogsForMonth();
        }}
        text="Show Monthly Logs"
      />

      {loading && <Text>Loading...</Text>}

      {notFound && <Text>No logs found for this month</Text>}

      {exerciseLogs.map((log, index) => (
        <>
          <Text key={index + "s"}>{log.stretch}</Text>
          <Text key={index + "t"}>{log.secondsSpentDoingStretch}</Text>
        </>
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

export default ExerciseLogs;

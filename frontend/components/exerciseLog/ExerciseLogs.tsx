import {
  Text,
  StyleSheet,
  View,
  DimensionValue,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import storage from "../../utilities/Storage";
import { ExerciseLog } from "../../interfaces/exerciseLog";

/** Load in logs of exercises and display them for the current month */
function ExerciseLogs() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

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
        });
    };
    loadExerciseLog();
  }, [loading, month, year]);

  return (
    <>
      {/* Add a month and year picker here */}
      <TouchableOpacity
        onPress={async () => {
          setLoading(true);
          loadLogsForMonth();
        }}
      >
        <Text>Set Month</Text>
      </TouchableOpacity>
      {exerciseLogs.map((log, index) => (
        <>
          <Text key={index}>{log.stretch}</Text>
          <Text key={index}>{log.secondsSpentDoingStretch}</Text>
        </>
      ))}
    </>
  );
}

export default ExerciseLogs;

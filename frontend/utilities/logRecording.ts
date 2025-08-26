import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { ExerciseLog, HealthLog, TimeOfDay } from "../interfaces/exerciseLog";
import { Stretch } from "../interfaces/stretchList";
import storage from "./storage";

export function getKeyForCurrentMonth(isLoadingExerciseLogs: boolean): string {
  const initialString = isLoadingExerciseLogs ? "exerciseLog" : "healthLog";
  const date = new Date();
  return `${initialString}-${date.getMonth()}-${date.getFullYear()}`;
}

/*Logs will be formatted in maps with the day of the month (1-31) as the key
and an array of ExerciseLog objects as the value */
export async function loadLogForCurrentMonth(
  isLoadingExerciseLogs: boolean
): Promise<Map<string, ExerciseLog[]> | Map<string, HealthLog>> {
  const logs = await storage
    .load({
      key: getKeyForCurrentMonth(isLoadingExerciseLogs),
      autoSync: true,
      syncInBackground: true,
    })
    .then((ret) => {
      console.log(ret.logs);

      //Either return exercise logs or health logs
      if (isLoadingExerciseLogs) {
        return new Map<string, ExerciseLog[]>(Object.entries(ret.logs));
      } else {
        return new Map<string, HealthLog>(Object.entries(ret.logs));
      }
    })
    .catch((error) => {
      console.warn(error);
      return undefined;
    });

  if (isLoadingExerciseLogs) {
    //Get an array of stretch logs for the current day or an empty array if none exist
    return logs || new Map<string, ExerciseLog[]>([]);
  } else {
    return logs || new Map<string, HealthLog>();
  }
}

export async function saveExercisesForCurrentDayToLog(
  stretches: Stretch[],
  currentStretchIndex: number
) {
  const currentStretch = stretches[currentStretchIndex];
  const date = new Date();
  const existingLogsForThisMonth: Map<string, ExerciseLog[]> =
    (await loadLogForCurrentMonth(true)) as Map<string, ExerciseLog[]>;
  const exercisesDoneToday =
    existingLogsForThisMonth.get(date.getDate().toString()) || [];

  if (currentStretch) {
    const keyForCurrentDay = date.getDate().toString();

    // Add the new log to the array and update the map for the current day
    exercisesDoneToday.push({
      date: new Date(),
      timeOfDay: getCurrentTimeOfDay(),
      stretch: currentStretch.name,
      secondsSpentDoingStretch: currentStretch.totalStretchTime,
      color: currentStretch.color,
    });

    existingLogsForThisMonth.set(keyForCurrentDay, exercisesDoneToday);
    console.log(
      "About to save this exercise log for ",
      existingLogsForThisMonth.get(keyForCurrentDay)
    );
    // Save the updated map back to storage
    await storage
      .save({
        key: getKeyForCurrentMonth(true),
        data: {
          logs: Object.fromEntries(existingLogsForThisMonth),
        },
      })
      .then(() => {
        console.log(
          "Saved exercise log for current day:",
          new Date().getDate().toString()
        );
        outputExerciseLogForCurrentDay();
      });
  }
}

//** Save a health log, with the pain and mental health values alongside a string for the key of the current day */
export async function saveHealthForSpecificDayToLog(
  healthLog: HealthLog,
  dayKey: string
) {
  const existingLogsForThisMonth: Map<string, HealthLog> =
    (await loadLogForCurrentMonth(false)) as Map<string, HealthLog>;

  if (healthLog && dayKey) {
    existingLogsForThisMonth.set(dayKey, healthLog);
    console.log(
      "About to save this health log",
      existingLogsForThisMonth.get(dayKey)
    );
    // Save the updated map back to storage
    await storage
      .save({
        key: getKeyForCurrentMonth(false),
        data: {
          logs: Object.fromEntries(existingLogsForThisMonth),
        },
      })
      .then(() => {
        console.log("Saved health log", healthLog);
        outputHealthLogForCurrentDay();
      });
  }
}

export async function outputExerciseLogForCurrentDay() {
  const date = new Date();
  const logsThisMonth = await loadLogForCurrentMonth(true);
  const currentDayLogs =
    (logsThisMonth.get(date.getDate().toString()) as ExerciseLog[]) || [];

  currentDayLogs.forEach((log) => {
    console.log(
      `Stretch: ${log.stretch}, Time: ${log.secondsSpentDoingStretch} seconds`
    );
  });
}

export async function outputHealthLogForCurrentDay() {
  const date = new Date();
  const logsThisMonth = await loadLogForCurrentMonth(false);
  const currentDayLogs =
    (logsThisMonth.get(date.getDate().toString()) as HealthLog) || undefined;

    if (currentDayLogs)
    {
      console.log(`Date: ${currentDayLogs.date} Pain: ${currentDayLogs.painLevel} Mental Health: ${currentDayLogs.mentalHealthLevel}`);
    }
  
}


export function getCurrentTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour > 6 && hour < 12) return 0; // Morning (6am-12pm)
  if (hour >= 12 && hour < 18) return 1; // Afternoon (12pm-6pm)
  return 2; // Evening (6pm-6am)
}
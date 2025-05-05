import { ExerciseLog } from "../interfaces/exerciseLog";
import { Stretch } from "../interfaces/stretchList";
import storage from "./Storage";

export function getKeyForCurrentMonth(): string {
  const date = new Date();
  return `exerciseLog-${date.getMonth()}-${date.getFullYear()}`
}

/*Logs will be formatted in maps with the day of the month (1-31) as the key
and an array of ExerciseLog objects as the value */
export async function loadExerciseLogForCurrentDay(): Promise<Map<string, ExerciseLog[]>> {

  const logs = await storage
    .load({
      key: getKeyForCurrentMonth(),
      autoSync: true,
      syncInBackground: true,
    })
    .then((ret) => {
      console.log(ret.logs);
      return new Map<string, ExerciseLog[]>(Object.entries(ret.logs));
    });

  //Get an array of stretch logs for the current day or an empty array if none exist
  return logs;
}

export async function saveExercisesForCurrentDayToLog(
  stretches: Stretch[],
  currentStretchIndex: number
) {
  const currentStretch = stretches[currentStretchIndex];
  const date = new Date();
  const existingLogsForThisMonth: Map<string, ExerciseLog[]> = await loadExerciseLogForCurrentDay();
  const exercisesDoneToday = existingLogsForThisMonth.get(date.getDate().toString()) || [];

  if (currentStretch) {
    const logKeyForCurrentDay = date.getDate().toString();

    // Add the new log to the array and update the map for the current day
    exercisesDoneToday.push({
      date: new Date(),
      timeOfDay: date.getHours() < 12 ? 0 : date.getHours() < 18 ? 1 : 2, // Morning, Afternoon, or Evening
      stretch: currentStretch.name,
      secondsSpentDoingStretch: currentStretch.totalStretchTime,
    });

    existingLogsForThisMonth.set(logKeyForCurrentDay, exercisesDoneToday);

    // Save the updated map back to storage
    await storage.save({
      key: getKeyForCurrentMonth(),
      data: {
        logs: existingLogsForThisMonth,
      },
    });
    console.log("Saved exercise log for current day:", new Date().getDate().toString());
    outputExerciseLogForCurrentDay();
  }
}

export function outputExerciseLogForCurrentDay() {
  const date = new Date();
  loadExerciseLogForCurrentDay().then((logs) => {
    const currentDayLogs = logs.get(date.getDate().toString()) || [];

    currentDayLogs.forEach((log) => {
      console.log(`Stretch: ${log.stretch}, Time: ${log.secondsSpentDoingStretch} seconds`);
    });
  });
}

export function outputExerciseLogForCurrentMonth() {
  loadExerciseLogForCurrentDay().then((logs) => {
    const currentMonthLogs = logs.get(getKeyForCurrentMonth()) || [];

    currentMonthLogs.forEach((log) => {
      console.log(`Stretch: ${log.stretch}, Time: ${log.secondsSpentDoingStretch} seconds`);
    });
  });
}
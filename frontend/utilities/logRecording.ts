import { ExerciseLog, HealthLog } from "../interfaces/exerciseLog";
import { Stretch } from "../interfaces/stretchList";
import storage from "./storage";

export function getKeyForCurrentMonth(): string {
  const date = new Date();
  return `exerciseLog-${date.getMonth()}-${date.getFullYear()}`;
}

/*Logs will be formatted in maps with the day of the month (1-31) as the key
and an array of ExerciseLog objects as the value */
export async function loadExerciseLogForCurrentMonth(): Promise<
  Map<string, ExerciseLog[]> | Map<string, HealthLog>
> {
  const logs = await storage
    .load({
      key: getKeyForCurrentMonth(),
      autoSync: true,
      syncInBackground: true,
    })
    .then((ret) => {
      console.log(ret.logs);
      return new Map<string, ExerciseLog[]>(Object.entries(ret.logs));
    })
    .catch((error) => {
      console.warn(error);
    });

  //Get an array of stretch logs for the current day or an empty array if none exist
  return logs || new Map<string, ExerciseLog[]>([]);
}

export async function saveExercisesForCurrentDayToLog(
  stretches: Stretch[],
  currentStretchIndex: number
) {
  const currentStretch = stretches[currentStretchIndex];
  const date = new Date();
  const existingLogsForThisMonth: Map<string, ExerciseLog[]> =
    await loadExerciseLogForCurrentMonth() as Map<string, ExerciseLog[]>;
  const exercisesDoneToday =
    existingLogsForThisMonth.get(date.getDate().toString()) || [];

  if (currentStretch) {
    const keyForCurrentDay = date.getDate().toString();

    // Add the new log to the array and update the map for the current day
    exercisesDoneToday.push({
      date: new Date(),
      timeOfDay: date.getHours() < 12 ? 0 : date.getHours() < 18 ? 1 : 2, // Morning, Afternoon, or Evening
      stretch: currentStretch.name,
      secondsSpentDoingStretch: currentStretch.totalStretchTime,
      color: currentStretch.color,
    });

    existingLogsForThisMonth.set(keyForCurrentDay, exercisesDoneToday);
    console.log(
      "About to save this",
      existingLogsForThisMonth.get(keyForCurrentDay)
    );
    // Save the updated map back to storage
    await storage
      .save({
        key: getKeyForCurrentMonth(),
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

export async function outputExerciseLogForCurrentDay() {
  const date = new Date();
  const logsThisMonth = await loadExerciseLogForCurrentMonth();
  const currentDayLogs = logsThisMonth.get(date.getDate().toString()) as ExerciseLog[] || [];

  currentDayLogs.forEach((log) => {
    console.log(
      `Stretch: ${log.stretch}, Time: ${log.secondsSpentDoingStretch} seconds`
    );
  });
}

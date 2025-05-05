import { ExerciseLog } from "../interfaces/exerciseLog";
import { Stretch } from "../interfaces/stretchList";
import storage from "./Storage";

export async function loadExerciseLogForCurrentDay() {
  const date = new Date();

  const logs = await storage
    .load({
      key: `exerciseLog-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
      autoSync: true,
      syncInBackground: true,
    })
    .then((ret) => {
      console.log(ret.logs);
      return ret.logs;
    });

    return logs || [];
}

export async function saveExercisesForCurrentDayToLog(
  stretches: Stretch[],
  currentStretchIndex: number
) {
  const currentStretch = stretches[currentStretchIndex];
  const date = new Date();
  const existingLogs : ExerciseLog[] = await loadExerciseLogForCurrentDay();

  if (currentStretch) {
    // Save the current stretch to the exercise log
    await storage.save({
      key: `exerciseLog-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
      data: {
        logs: existingLogs.push({
          date: date,
          timeOfDay: date.getHours() < 12 ? 0 : date.getHours() < 18 ? 1 : 2, //Morning, Afternoon, or Evening
          stretch: currentStretch.name,
          secondsSpentDoingStretch: currentStretch.totalStretchTime,
        }),
        time: currentStretch.totalStretchTime,
      },
    });
  }
}

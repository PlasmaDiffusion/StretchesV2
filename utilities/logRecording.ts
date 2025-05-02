import { Stretch } from "../interfaces/stretchList";
import storage from "./Storage";

 export async function loadExerciseLogForCurrentMonth() {
    const date = new Date();

    .load({
        key: `exerciseLog-${date.getMonth()}-${date.getFullYear()}`,
        autoSync: true,
        syncInBackground: true,
      })
      .then((ret) => {
        console.log(ret.logs);
        return ret.logs;
      }
  }

 export async function saveLastExerciseYouCompletedToLog(stretches:Stretch[], currentStretchIndex:number) {
    const currentStretch = stretches[currentStretchIndex];
    const date = new Date();
    const existingLogsFromThisMonth = await loadExerciseLogForCurrentMonth();
    if (currentStretch) {
      // Save the current stretch to the exercise log
      await storage.save({
        key: `exerciseLog-${date.getMonth()}-${date.getFullYear()}`,
        data: {
          logs: '',
          time: currentStretch.totalStretchTime,
        },
      });
    }
  }
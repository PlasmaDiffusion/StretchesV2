//Daily / nightly pop up for logging massages. Some people manage chronic pain by massaging sore areas or trigger points.
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import {
    getCurrentTimeOfDay,
  loadLogForCurrentMonth,
  saveExercisesForCurrentDayToLog,
} from "../../../utilities/logRecording";
import { Stretch } from "../../../interfaces/stretchList";
import { GeneralModal } from "../../commonComponents/GeneralModal";
import { ExerciseLog, TimeOfDay } from "../../../interfaces/exerciseLog";

function getMassagePromptText(): string {
  if (getCurrentTimeOfDay() === TimeOfDay.Morning) {
    return "Did you do any extra massages this morning or last night?";
  }
  else return "This pop up asks if you did any extra massages every morning.";
}

function MassageLogPopUp({}) {
  const [modalVisible, setModalVisible] = useState(true);

  const recordMassages = useCallback(
    (seconds: number, minutes: number, hours: number) => {
      const stretches: Stretch[] = [
        {
          name: "Extra Massages",
          color: "#5555FF",
          totalStretchTime: hours * 60 * 60 + minutes * 60 + seconds,
        },
      ];
      saveExercisesForCurrentDayToLog(stretches, 0);
    },
    []
  );

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    async function checkLogs() {
      const date = new Date();
      const logsForMonth = await loadLogForCurrentMonth(true);
      const logsForToday =
        (logsForMonth.get(date.getDate().toString()) as ExerciseLog[]) || [];
      const currentTimeOfDay = getCurrentTimeOfDay();

      // Check if any log for today matches the current time of day
      const found = logsForToday.some(
        (log) =>
          log.timeOfDay === currentTimeOfDay && log.stretch === "Extra Massages"
      );

      if (!found && getCurrentTimeOfDay() !== TimeOfDay.Morning) {
        setModalVisible(true);
        setShouldRender(true);
      }
    }
    checkLogs();
  }, []);

  if (!shouldRender) return null;

  return (
    <GeneralModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      onConfirm={() => setModalVisible(false)}
      text={getMassagePromptText()}
    >
      <View></View>
    </GeneralModal>
  );
}

export default MassageLogPopUp;

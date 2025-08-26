import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import {
  getCurrentTimeOfDay,
  loadLogForCurrentMonth,
  saveExercisesForCurrentDayToLog,
} from "../../../utilities/logRecording";
import { Stretch } from "../../../interfaces/stretchList";
import { GeneralModal } from "../../commonComponents/GeneralModal";
import { ExerciseLog, TimeOfDay } from "../../../interfaces/exerciseLog";
import { useRef as reactUseRef } from "react";
import { TimeInput } from "../../commonComponents/TimeInput";

// Daily pop up for logging massages. Some people manage chronic pain by massaging sore areas or trigger points.
function MassageLogPopUp({}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const MAX_HOURS = 10;
  const MAX_MINUTES = 600;

  useEffect(() => {
    async function checkLogs() {
      const date = new Date();
      const logsForMonth = await loadLogForCurrentMonth(true);

      if (!logsForMonth) return;

      const logsForToday =
        (logsForMonth.get?.(date.getDate().toString()) as ExerciseLog[]) || [];

      const found =
        Array.isArray(logsForToday) &&
        logsForToday.some(
          (log) =>
            log.timeOfDay === TimeOfDay.Morning &&
            log.stretch === "Extra Massages"
        );

      if (!found && getCurrentTimeOfDay() === TimeOfDay.Morning) {
        setModalVisible(true);
      }
    }
    checkLogs();
  }, []);

  const recordMassages = useCallback((minutes: number, hours: number) => {
    const stretches: Stretch[] = [
      {
        name: "Extra Massages",
        color: "#5555FF",
        totalStretchTime: hours * 60 * 60 + minutes * 60,
      },
    ];
    saveExercisesForCurrentDayToLog(stretches, 0);
  }, []);

  // Make sure the time values to be logged aren't in the negatives or ridiculously high when confirming input
  const handleConfirm = () => {
    const hourNum = parseInt(hours) || 0;
    const minuteNum = parseInt(minutes) || 0;
    let valid = true;

    if (hourNum > MAX_HOURS || hourNum <= -1) {
      valid = false;
    }

    if (minuteNum > MAX_MINUTES || minuteNum <= -1) {
      valid = false;
    }

    if (!valid) return;

    recordMassages(minuteNum, hourNum);
    setModalVisible(false);
  };

  return (
    <GeneralModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      onConfirm={handleConfirm}
      text={`Did you do any extra massages this morning or last night?\n\nIf so, you can log roughly how long you did in minutes and/or hours.`}
      confirmText="Yes, Log It"
      cancelText="No"
    >
      <TimeInput
        hours={hours}
        minutes={minutes}
        setHours={setHours}
        setMinutes={setMinutes}
        maxHours={MAX_HOURS}
        maxMinutes={MAX_MINUTES}
      />
    </GeneralModal>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 32,
  },
  inputGroup: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    width: 50,
    height: 48,
    marginHorizontal: 8,
    paddingHorizontal: 8,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default MassageLogPopUp;

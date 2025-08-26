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

// Daily pop up for logging massages. Some people manage chronic pain by massaging sore areas or trigger points.
function MassageLogPopUp({}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [hourError, setHourError] = useState("");
  const [minuteError, setMinuteError] = useState("");
  const minuteInputRef = useRef<TextInput>(null);

  const MAX_HOURS = 10;
  const MAX_MINUTES = 600;

  useEffect(() => {
    async function checkLogs() {
      const date = new Date();
      const logsForMonth = await loadLogForCurrentMonth(true);
      const logsForToday =
        (logsForMonth.get(date.getDate().toString()) as ExerciseLog[]) || [];

      // Check if any log for today matches the current time of day
      const found = logsForToday.some(
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

  const handleConfirm = () => {
    const hourNum = parseInt(hours) || 0;
    const minuteNum = parseInt(minutes) || 0;
    let valid = true;

    if (hourNum > MAX_HOURS) {
      setHourError(`Max hours is ${MAX_HOURS}`);
      valid = false;
    } else {
      setHourError("");
    }

    if (minuteNum > MAX_MINUTES) {
      setMinuteError(`Max minutes is ${MAX_MINUTES}`);
      valid = false;
    } else {
      setMinuteError("");
    }

    if (!valid) return;

    recordMassages(minuteNum, hourNum);
    setModalVisible(false);
  };

  return (
    <GeneralModal
      visible={true}
      onClose={() => setModalVisible(false)}
      onConfirm={handleConfirm}
      text={`Did you do any extra massages this morning or last night?\n\nIf so, you can log roughly how long you did in minutes and/or hours.`}
      confirmText="Yes, Log It"
      cancelText="No"
    >
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text>Hours:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={hours}
            onChangeText={(val) => {
              const num = parseInt(val) || 0;
              setHours(val);
              if (num > MAX_HOURS || num < 0) {
                setHourError(`Max hours is ${MAX_HOURS}`);
              } else {
                setHourError("");
              }
            }}
            placeholder={`0-${MAX_HOURS}`}
            onSubmitEditing={() =>
              setTimeout(() => minuteInputRef.current?.focus(), 100)
            }
          />
          {hourError ? <Text style={styles.errorText}>{hourError}</Text> : null}
        </View>
        <View style={styles.inputGroup}>
          <Text>Minutes:</Text>
          <TextInput
            ref={minuteInputRef}
            style={styles.input}
            keyboardType="numeric"
            value={minutes}
            onChangeText={(val) => {
              const num = parseInt(val) || 0;
              setMinutes(val);
              if (num > MAX_MINUTES || num < 0) {
                setMinuteError(`Max minutes is ${MAX_MINUTES}`);
              } else {
                setMinuteError("");
              }
            }}
            placeholder={`0-${MAX_MINUTES}`}
          />
          {minuteError ? (
            <Text style={styles.errorText}>{minuteError}</Text>
          ) : null}
        </View>
      </View>
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

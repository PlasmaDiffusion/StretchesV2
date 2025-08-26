import React, { useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface TimeInputProps {
  hours: string;
  minutes: string;
  setHours: (val: string) => void;
  setMinutes: (val: string) => void;
  maxHours: number;
  maxMinutes: number;
}

export function TimeInput({
  hours,
  minutes,
  setHours,
  setMinutes,
  maxHours,
  maxMinutes,
}: TimeInputProps) {
  const minuteInputRef = useRef<TextInput>(null);
  const [hourError, setHourError] = useState("");
  const [minuteError, setMinuteError] = useState("");

  return (
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
            if (num > maxHours || num < 0) {
              setHourError(`Max hours is ${maxHours}`);
            } else {
              setHourError("");
            }
          }}
          placeholder={`0-${maxHours}`}
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
            if (num > maxMinutes || num < 0) {
              setMinuteError(`Max minutes is ${maxMinutes}`);
            } else {
              setMinuteError("");
            }
          }}
          placeholder={`0-${maxMinutes}`}
        />
        {minuteError ? (
          <Text style={styles.errorText}>{minuteError}</Text>
        ) : null}
      </View>
    </View>
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

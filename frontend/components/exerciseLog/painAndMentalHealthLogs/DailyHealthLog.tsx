import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import IntensityPicker from "./IntensityPicker";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../commonComponents/CustomButton";
import { saveHealthForSpecificDayToLog } from "../../../utilities/logRecording";
import { HealthLog } from "../../../interfaces/exerciseLog";

interface Props {
  healthLog?: HealthLog;
  dayKey: string;
}

//** Displays and lets you modify pain + mental health records  */
function DailyHealthLog({ healthLog, dayKey }:Props){
  const [painValueToChangeTo, setPainValueToChangeTo] = useState<number>();
  const [mentalHealthValueToChangeTo, setMentalHealthToChangeTo] =
    useState<number>();
  const [showUpdateHealthLogPrompt, setShowUpdateHealthLogPrompt] =
    useState(false);


  const updateHealthLog = useCallback(() => {
    let updatedHealthLog = healthLog
      ? healthLog
      : {
          mentalHealthLevel: -1,
          painLevel: -1,
          date: new Date(),
        };

    updatedHealthLog.painLevel =
      painValueToChangeTo ?? updatedHealthLog?.painLevel ?? -1;
    updatedHealthLog.mentalHealthLevel =
      mentalHealthValueToChangeTo ?? updatedHealthLog?.mentalHealthLevel ?? -1;

    saveHealthForSpecificDayToLog(updatedHealthLog, dayKey);
    setShowUpdateHealthLogPrompt(false);
  }, [painValueToChangeTo, mentalHealthValueToChangeTo, healthLog, dayKey]);

  return (
    <View>
      <Text style={styles.heading}>Pain</Text>
      <Text style={styles.heading}>{healthLog?.painLevel ?? -1}</Text>
      <View style={styles.innerContainer}>
        <IntensityPicker
          type="Pain"
          previouslyPickedValue={healthLog?.painLevel ?? -1}
          updatePickedValue={(val: number) => {
            setPainValueToChangeTo(val);
            setShowUpdateHealthLogPrompt(true);
          }}
        />
      </View>
      <Text style={styles.heading}>Mental Health</Text>
      <View style={styles.innerContainer}>
        <IntensityPicker
          type="Mental Health"
          previouslyPickedValue={
            mentalHealthValueToChangeTo ?? healthLog?.mentalHealthLevel ?? -1
          }
          updatePickedValue={(val: number) => {
            setMentalHealthToChangeTo(val);
            setShowUpdateHealthLogPrompt(true);
          }}
        />
      </View>
      {showUpdateHealthLogPrompt && (
        <View style={styles.rowOfButtons}>
          <PrimaryButton
            text="Confirm Change"
            onPress={updateHealthLog}
            color="#00aaff"
          />
          <SecondaryButton
            text="Cancel Change"
            onPress={() => setShowUpdateHealthLogPrompt(false)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    borderStyle: "dotted",
    backgroundColor: "white",
    padding: 5,
  },
  heading: { marginVertical: 5 },
  rowOfButtons: { display: "flex", flexDirection: "row" },
});

export default DailyHealthLog;

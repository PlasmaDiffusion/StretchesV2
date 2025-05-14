import { StyleSheet, View } from "react-native";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../commonComponents/CustomButton";
import { useEffect, useState } from "react";

interface Props {
  type: "Pain" | "Mental Health";
  previouslyPickedValue: number;
  updatePickedValue: (value: number) => void;
  parentIsShowingConfirmPrompt: boolean; //When the prompt to change the intensity value is cancelled, change back to defaults
}

//Labels to show names for each 1-6 pain value. Currently unused.
const painLabels = [
  "None",
  "Discomfort",
  "Mild Pain",
  "Moderate Pain",
  "Severe Pain",
  "Extreme Pain",
];
const mentalHealthLabels = [
  "Happy",
  "Okay",
  "Agitated",
  "Depressed",
  "Very Unwell",
  "Crisis",
];

const colorsToUse = [
  "#009900", //green
  "#EECC00", //yellow
  "#FFA500", //yellow-orange
  "#FF5500", //orange
  "#CC0000", //red
  "#800080", //purple
];

/** Shows how much in pain you were or your mental health levels, and it can allow you to record it for the day. */
function IntensityPicker({
  type,
  previouslyPickedValue,
  updatePickedValue,
  parentIsShowingConfirmPrompt,
}: Props) {
  const [labelsToUse, setLabelsToUse] = useState<string[]>([]);
  const [valueToChangeTo, setValueToChangeTo] = useState<number>(-1);

  useEffect(() => {
    if (type === "Pain") {
      setLabelsToUse(painLabels);
    } else if (type === "Mental Health") {
      setLabelsToUse(mentalHealthLabels);
    }
  }, [type]);

  useEffect(() => {
    // Set changed value to default previously picked value on initial load or when cancelling a change
    if (!parentIsShowingConfirmPrompt) {
      setValueToChangeTo(previouslyPickedValue ?? 0);
    }
  }, [previouslyPickedValue, parentIsShowingConfirmPrompt]);

  return (
    <>
      <View style={styles.rowOfButtons}>
        {labelsToUse.map((label, index) =>
          index !== valueToChangeTo ? (
            <SecondaryButton
              text={(index + 1).toString()}
              color={colorsToUse[index]}
              onPress={() => {
                setValueToChangeTo(index);
                updatePickedValue(index);
              }}
              key={label}
              italics={index === previouslyPickedValue}
            />
          ) : (
            <PrimaryButton
              text={(index + 1).toString()}
              color={colorsToUse[index]}
              onPress={() => {
                setValueToChangeTo(index);
                updatePickedValue(index);
              }}
              key={label}
              italics={index === previouslyPickedValue}
            />
          )
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  rowOfButtons: { display: "flex", flexDirection: "row" },
});

export default IntensityPicker;

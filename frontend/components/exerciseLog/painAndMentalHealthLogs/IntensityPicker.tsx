import { Text, StyleSheet, View } from "react-native";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../commonComponents/CustomButton";
import { useEffect, useState } from "react";

interface Props {
  type: "Pain" | "Mental Health";
  pickedValue: number;
  setPickedValue: (value: number) => void;
}

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

function IntensityPicker({ type, pickedValue, setPickedValue }: Props) {
  const [labelsToUse, setLabelsToUse] = useState<string[]>([]);
  const [valueToChangeTo, setValueToChangeTo] = useState<number>(pickedValue);

  useEffect(() => {
    if (type === "Pain") {
      setLabelsToUse(painLabels);
    } else if (type === "Mental Health") {
      setLabelsToUse(mentalHealthLabels);
    }
  }, [type]);

  return (
    <>
      {valueToChangeTo !== pickedValue && (
        <View style={styles.rowOfButtons}>
          <PrimaryButton text="Confirm Change" onPress={() => {setPickedValue(valueToChangeTo)}} />
          <SecondaryButton text="Cancel Change" onPress={() => {setValueToChangeTo(pickedValue)}} />
        </View>
      )}

      <View style={styles.rowOfButtons}>
        {labelsToUse.map((label, index) =>
          index !== valueToChangeTo ? (
            <SecondaryButton
              text={(index + 1).toString()}
              color={colorsToUse[index]}
              onPress={() => {
                setValueToChangeTo(index);
              }}
              key={label}
            />
          ) : (
            <PrimaryButton
              text={(index + 1).toString()}
              color={colorsToUse[index]}
              onPress={() => {
                setValueToChangeTo(index);
              }}
              key={label}
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

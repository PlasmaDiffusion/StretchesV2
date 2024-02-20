import { useCallback, useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Stretch } from "../../utilities/stretchList";
import storage from "../../utilities/Storage";

interface Props {
  stretch: Stretch;
  index: number;
  prevStretches: Stretch[];
  setStretches: (newStretches: Stretch[]) => any;
}

export default function StretchEditForm({
  stretch,
  index,
  prevStretches,
  setStretches,
}: Props) {
  const [name, onChangeName] = useState(stretch.name);
  const [color, setColor] = useState(stretch.color);

  const possibleColours = ["lightCoral", "salmon"];

  return (
    <>
      <TextInput onChangeText={onChangeName} value={name} />
      {possibleColours.map((color) => (
        <>
          <TouchableOpacity
            style={[styles.colorButton, { backgroundColor: color }]}
            onPress={() => setColor(color)}
          />
        </>
      ))}

      <Button
        onPress={() => {
          let newStretches = [...prevStretches];
          newStretches[index].name = name;
          newStretches[index].color = color;
          setStretches(prevStretches);
        }}
        title="Save Stretch"
      />
    </>
  );
}

const styles = StyleSheet.create({
  colorButton: {
    borderWidth: 1,
  },
});

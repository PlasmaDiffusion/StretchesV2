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

  const possibleColours = [
    "lightcoral",
    "salmon",
    "#DC143C",
    "#DE3163",
    "#66b2b2",
    "#008080",
    "green",
  ];

  return (
    <>
      <TextInput
        style={[styles.inputText, { color: color }]}
        onChangeText={onChangeName}
        value={name}
      />

      <View style={styles.colorGrid}>
      {possibleColours.map((color) => (
          <TouchableOpacity
            style={[styles.colorButton, { backgroundColor: color }]}
            onPress={() => setColor(color)}
          />
      ))}
       </View>

      <Button
        onPress={() => {
          let newStretches = [...prevStretches];
          newStretches[index].name = name;
          newStretches[index].color = color;
          setStretches(newStretches);
        }}
        title="Save Stretch"
      />
    </>
  );
}

const styles = StyleSheet.create({
  colorButton: {
    borderWidth: 1,
    height: 32,
    width: 32,
    margin: 16,
  },
  colorGrid: {
    display: 'flex',
    flexDirection: 'row',
  },
  inputText: {
    fontSize: 24,
  }
});

import { useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { Stretch } from "../../../interfaces/stretchList";
import React from "react";

interface Props {
  stretch: Stretch;
  index: number;
  prevStretches: Stretch[];
  setStretches: (newStretches: Stretch[]) => any;
  onBackPressed: () => any;
}

export default function StretchEditForm({
  stretch,
  index,
  prevStretches,
  setStretches,
  onBackPressed,
}: Props) {
  const [name, onChangeName] = useState(stretch.name);
  const [reference1, setReference1] = useState("");
  const [reference2, setReference2] = useState("");

  const [color, setColor] = useState(stretch.color);

  const [edited, setEdited] = useState(false);

  useEffect(() => {
    if (stretch.links) {
      setReference1(stretch.links[0] || "");
      setReference2(stretch.links[1] || "");
    }
  }, [stretch]);

  const possibleColours = [
    "lightcoral",
    "salmon",
    "#DC143C",
    "#DE3163",
    "#5555FF",
    "#AAAAFF",
    "#AA00FF",
    "#66b2b2",
    "#58D68D",
    "green",
    "yellowgreen",
    "gold",
    "orange",
  ];

  return (
    <>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={[styles.inputText, { color: color }]}
        onChangeText={onChangeName}
        value={name}
      />

      <Text style={styles.label}>Colour:</Text>
      <View style={{ height: 48 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.colorGrid}>
            {possibleColours.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorButton, { backgroundColor: color }]}
                onPress={() => setColor(color)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <Text style={styles.label}>Reference Link 1:</Text>
      <TextInput
        style={[styles.inputText, { color: color }]}
        onChangeText={setReference1}
        value={reference1}
      />

      <Text style={styles.label}>Reference Link 2:</Text>
      <TextInput
        style={[styles.inputText, { color: color }]}
        onChangeText={setReference2}
        value={reference2}
      />

      <View style={styles.buttons}>
        <Button
          onPress={() => {
            let newStretches = [...prevStretches];
            newStretches[index].name = name;
            newStretches[index].color = color;
            newStretches[index].links = [reference1, reference2];
            setStretches(newStretches);
            setEdited(true);
          }}
          title={edited ? "Applied!" : "Apply"}
        />
      </View>
      <View style={styles.buttons}>
        <Button onPress={onBackPressed} title="Back" />
      </View>
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
    display: "flex",
    flexDirection: "row",
  },
  inputText: {
    fontSize: 24,
    borderWidth: 1,
    height: 64,
    margin: 16,
    marginTop: 0,
  },
  label: {
    fontSize: 16,
    margin: 16,
    marginBottom: 0,
  },
  buttons: {
    maxWidth: 128,
    display: "flex",
    alignSelf: "center",
    marginVertical: 16,
  },
});

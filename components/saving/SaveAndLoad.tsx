import { useCallback, useEffect, useState } from "react";
import { View, Button, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Stretch } from "../../utilities/stretchList";
import storage from "../../utilities/Storage";

interface Props {
  currentStretches: Stretch[];
  setStretches: (newStretches: Stretch[]) => any;
}

export default function SaveAndLoad({ currentStretches, setStretches }: Props) {
  const [key, setKey] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const savePressed = useCallback(async () => {
    if (key.includes("_")) {
      setStatusMessage("Save name should no include underscores.");
      return;
    }
    //Save stretches
    await storage
      .save({
        key: key,
        data: {
          stretches: [...currentStretches],
        },
      })
      .then(() => {
        setStatusMessage("Saved!");
      })
      .catch(async (error: Error) => {
        setStatusMessage(error.message);
      });
  }, [currentStretches]);

  const loadPressed = useCallback(() => {
    if (key.includes("_")) {
      setStatusMessage("Save name should no include underscores.");
      return;
    }
    storage
      .load({
        key: key,
        autoSync: true,
        syncInBackground: true,
      })
      .then((ret) => {
        console.log(ret.stretches);
        setStretches(ret.stretches);
        setStatusMessage("Loaded!");
      })
      .catch((error: Error) => {
        console.warn(error.message);
        switch (error.name) {
          case "NotFoundError":
            setStatusMessage("The save was not found.");
            break;
          case "ExpiredError":
            setStatusMessage("The save expired.");
            break;
          default:
            setStatusMessage(error.message);
            break;
        }
      });
  }, [currentStretches]);

  const slots = [1, 2, 3];

  return (
    <View>
      <Text>{statusMessage}</Text>

      <View style={styles.buttonContainer}>
        {slots.map((slot, index) => (
          <TouchableOpacity
            onPress={() => {
              setKey(`save${index}`);
            }}
            style={styles.slotButton}
          >
            <Text style={key === `save${index}` ? styles.selectSlot : styles.unSelectedSlot}>
              {slot}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={savePressed} />
        <Button title="Load" onPress={loadPressed} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    gap: 32,
  },
  input: {
    textAlign: "center",
    borderWidth: 1,
    height: 48,
    marginBottom: 4,
  },
  slotButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
  },
  selectSlot: {
    color: "red",
    textAlign:'center',
  },
  unSelectedSlot: {
    color: "blue",
    textAlign:'center',
  },
});

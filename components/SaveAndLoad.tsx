import { useCallback, useState } from "react";
import { View, Button, TouchableOpacity, Text, TextInput } from "react-native";
import { Stretch } from "../utilities/stretchList";
import storage from "../utilities/Storage";

interface Props {
  currentStretches: Stretch[];
  setStretches: (newStretches: Stretch[]) => any;
}

export default function SaveAndLoad({ currentStretches }: Props) {
  const [key, setKey] = useState("");
  const [statusMessage, setStatusMessage] = useState("");


  const savePressed = useCallback(async () => {
    if (key.includes("_")) {
      setStatusMessage("Save name should no include underscores.");
      return;
    }
    //Save stretches
    await storage.save({
      key: key, // Note: Do not use underscore("_") in key!
      data: {
        stretches: [...currentStretches],
      },
    });

    //Save the key names used to list them later
    let prevSaves: string[];

    await storage
      .load({
        key: "Save Names",
        autoSync: true,
        syncInBackground: true,
      })
      .then(async (ret) => {
        prevSaves = ret.val;
        await storage.save({
          key: "Save Names",
          data: {
            saveNames: [...prevSaves, key],
          },
        });
        setStatusMessage('Saved!');
      })
      .catch((err) => {
        setStatusMessage(err);
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

        // autoSync (default: true) means if data is not found or has expired,
        // then invoke the corresponding sync method
        autoSync: true,

        // syncInBackground (default: true) means if data expired,
        // return the outdated data first while invoking the sync method.
        // If syncInBackground is set to false, and there is expired data,
        // it will wait for the new data and return only after the sync completed.
        // (This, of course, is slower)
        syncInBackground: true,
      })
      .then((ret) => {
        setStretches(ret.stretches)
        setStatusMessage('Loaded!');
      })
      .catch((err) => {
        // any exception including data not found
        // goes to catch()
        console.warn(err.message);
        switch (err.name) {
          case "NotFoundError":
            setStatusMessage("The save was not found.");
            break;
          case "ExpiredError":
            setStatusMessage("The save expired.");
            break;
          default:
            setStatusMessage(err);
            break;
        }
      });
  }, [currentStretches]);

  return (
    <View>
      <Text>{statusMessage}</Text>
      <TextInput onChangeText={setKey} placeholder="Save name" />
      <Button title="Save" onPress={savePressed} />
      <Button title="Load" onPress={loadPressed} />
    </View>
  );
}

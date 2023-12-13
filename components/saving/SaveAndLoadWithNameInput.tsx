import { useCallback, useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import { Stretch } from "../../utilities/stretchList";
import storage from "../../utilities/Storage";

interface Props {
  currentStretches: Stretch[];
  setStretches: (newStretches: Stretch[]) => any;
}

//Unused component with manual save file name entry
export default function SaveAndLoadWithNameInput({ currentStretches, setStretches }: Props) {
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
        setStatusMessage("Saved!");
      })
      .catch(async (error: Error) => {
        if (error.name === "NotFoundError") {
          await storage.save({
            key: "Save Names",
            data: {
              saveNames: [key],
            },
          });
          setStatusMessage("Saved!");
        }
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
        console.log(ret.stretches);
        setStretches(ret.stretches);
        setStatusMessage("Loaded!");
      })
      .catch((error: Error) => {
        // any exception including data not found
        // goes to catch()
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

  //Load prev saves in to list them out when load is pressed
  useEffect(() => {}, []);

  return (
    <View>
      <Text>{statusMessage}</Text>
      <TextInput
        style={styles.input}
        onChangeText={setKey}
        placeholder="Save name"
      />
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
});

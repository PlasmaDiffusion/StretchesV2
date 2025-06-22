import { useCallback, useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Stretch } from "../../../interfaces/stretchList";
import storage from "../../../utilities/storage";
import React from "react";

interface Props {
  currentStretches: Stretch[];
  setStretches: (newStretches: Stretch[]) => any;
}

export default function SaveAndLoad({ currentStretches, setStretches }: Props) {
  const [key, setKey] = useState("save1");
  const [saveName, setSaveName] = useState("");
  const [saveNamesToRender, setSaveNamesToRender] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  const slots = [1, 2, 3];

  // Load all saveNames for slots on mount and when a save is made
  const refreshSaveNames = useCallback(async () => {
    const names: string[] = [];
    for (let i = 1; i <= slots.length; i++) {
      try {
        const ret = await storage.load({
          key: `save${i}`,
          autoSync: false,
          syncInBackground: false,
        });
        names.push(ret.saveName || "");
      } catch {
        names.push("");
      }
    }
    setSaveNamesToRender([...names]);
  }, [slots.length]);

  useEffect(() => {
    if (statusMessage === "" || statusMessage.includes("Saved")) {
      refreshSaveNames();
    }
  }, [refreshSaveNames, statusMessage]);

  const savePressed = useCallback(async () => {
    if (key.includes("_")) {
      setStatusMessage("Save name should not include underscores.");
      return;
    }
    //Save stretches
    await storage
      .save({
        key: key,
        data: {
          stretches: [...currentStretches],
          saveName: saveName,
        },
      })
      .then(() => {
        setStatusMessage("Saved!");
      })
      .catch(async (error: Error) => {
        setStatusMessage(error.message);
      });
  }, [currentStretches, key]);

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
        //Load stretches through prop
        setStretches(ret.stretches);
        setStatusMessage(`Loaded ${key}`);
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
  }, [currentStretches, key]);

  //Hide load after a moment
  useEffect(() => {
    if (statusMessage.includes("Loaded")) {
      setTimeout(() => {
        setStatusMessage("");
      }, 2000);
    }
  }, [statusMessage]);

  return (
    <View>
      <Text>{statusMessage}</Text>

      <Text>{saveName}</Text>
      <TextInput
        style={styles.input}
        value={saveName}
        onChangeText={setSaveName}
        placeholder="Enter save name"
        autoCapitalize="none"
      />

      <View style={styles.buttonContainer}>
        {slots.map((slot) => (
          <TouchableOpacity
            onPress={() => {
              setKey(`save${slot}`);
            }}
            style={styles.slotButton}
            key={`saveOpacityKey${slot}`}
          >
            <Text
              style={
                key === `save${slot}`
                  ? styles.selectSlot
                  : styles.unSelectedSlot
              }
            >
              {saveNamesToRender[slot - 1] || slot}
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
    marginVertical: 8,
  },
  input: {
    textAlign: "center",
    borderWidth: 1,
    height: 48,
    marginBottom: 4,
  },
  slotButton: {
    width: 32,
    height: 24,
    borderWidth: 1,
    borderRadius: 4,
  },
  selectSlot: {
    color: "red",
    textAlign: "center",
  },
  unSelectedSlot: {
    color: "blue",
    textAlign: "center",
  },
});

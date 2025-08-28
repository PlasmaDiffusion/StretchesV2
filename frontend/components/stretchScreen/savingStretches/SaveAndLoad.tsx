import { useCallback, useEffect, useRef, useState, useMemo } from "react";
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
import { HeadingText } from "../../commonComponents/HeadingText";
import {
  saveStretchesToSlot,
  loadStretchesFromSlot,
  loadAllSaveNames,
} from "../../../utilities/stretchSaving";

interface Props {
  currentStretches: Stretch[];
  setStretches: (newStretches: Stretch[]) => any;
}

export default function SaveAndLoad({ currentStretches, setStretches }: Props) {
  const [key, setKey] = useState("save1");
  const [saveName, setSaveName] = useState("");
  const [saveNamesToRender, setSaveNamesToRender] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [saveConfirm, setSaveConfirm] = useState(false);

  const slots = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8, 9], []);
  const [currentSlot, setCurrentSlot] = useState(1);

  const [showSaveNameInput, setShowSaveNameInput] = useState(false);
  const lastTapRef = useRef<number | null>(null);

  // Load all saveNames for slots on mount
  const refreshSaveNames = useCallback(async () => {
    if (saveNamesToRender.length === 0) {
      const names = await loadAllSaveNames(slots);
      setSaveNamesToRender([...names]);
      setSaveName(names[0] || currentSlot.toString());
    }
  }, [currentSlot, saveNamesToRender.length, slots]);

  //Hide status message after it's shown for a while
  useEffect(() => {
    if (statusMessage) {
      const timeout = setTimeout(() => {
        setStatusMessage("");
      }, 2500); // 2.5 seconds
      return () => clearTimeout(timeout);
    }
  }, [statusMessage]);

  // Load save names on mount or when a new save is made
  useEffect(() => {
    if (saveNamesToRender.length === 0) {
      refreshSaveNames();
    }
  }, [refreshSaveNames, saveNamesToRender.length]);

  const savePressed = useCallback(async () => {
    if (!saveConfirm) {
      setSaveConfirm(true);
      setStatusMessage(""); // Clear any previous status
      return;
    }
    if (key.includes("_")) {
      setStatusMessage("Save name should not include underscores.");
      setSaveConfirm(false);
      return;
    }
    const saveNameToUse =
      saveNamesToRender[currentSlot - 1] || currentSlot.toString();
    try {
      await saveStretchesToSlot(key, currentStretches, saveNameToUse);
      setStatusMessage(`Saved ${saveNameToUse}!`);
      refreshSaveNames();
    } catch (error: any) {
      setStatusMessage(error.message);
    }
    setSaveConfirm(false); // Reset after saving
  }, [
    currentStretches,
    key,
    currentSlot,
    saveNamesToRender,
    refreshSaveNames,
    saveConfirm,
  ]);

  // Reset saveConfirm if slot changes or after a short timeout
  useEffect(() => {
    setSaveConfirm(false);
  }, [key, currentSlot]);

  const loadPressed = useCallback(async () => {
    if (key.includes("_")) {
      setStatusMessage("Save name should no include underscores.");
      return;
    }
    try {
      const ret = await loadStretchesFromSlot(key);
      setStretches(ret.stretches);
      setStatusMessage(`Loaded ${saveNamesToRender[currentSlot - 1]}`); // (${key})
    } catch (error: any) {
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
    }
  }, [key, setStretches, saveNamesToRender, currentSlot]);

  return (
    <View style={styles.roundedBorder}>
      <HeadingText size="small" verticalSpacing={8}>
        Presets
      </HeadingText>
      {statusMessage && <Text>{statusMessage}</Text>}

      {showSaveNameInput && (
        <TextInput
          style={styles.input}
          value={saveName}
          onChangeText={(inputText) => {
            setSaveName(inputText);
            setSaveNamesToRender((prev) => {
              const newNames = [...prev];
              newNames[currentSlot - 1] = inputText;
              return newNames;
            });
          }}
          placeholder="Enter save name"
          autoCapitalize="none"
        />
      )}

      {/* Horizontally scrollable list of slot buttons */}
      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollListContent}
        horizontal={true}
        showsHorizontalScrollIndicator={true}
      >
        {slots.map((slot) => (
          <TouchableOpacity
            onPress={() => {
              const now = Date.now();

              //Double tap to rename
              if (
                lastTapRef.current &&
                now - lastTapRef.current < 300 &&
                currentSlot === slot
              ) {
                setShowSaveNameInput(true);
              } else {
                //On tap, load from that slot
                setShowSaveNameInput(false);
                setKey(`save${slot}`);
                setCurrentSlot(slot);
                setSaveName(saveNamesToRender[slot - 1] || slot.toString());
              }
              lastTapRef.current = now;
            }}
            style={[
              styles.slotButton,
              key === `save${slot}` ? styles.selectSlot : styles.unSelectedSlot,
            ]}
            key={`saveOpacityKey${slot}`}
          >
            <Text style={styles.slotButtonText}>
              {saveNamesToRender[slot - 1] || `Slot ${slot}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title={saveConfirm ? "Save?" : "Save"} onPress={savePressed} />
        <Button title="Load" onPress={loadPressed} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  roundedBorder: {
    borderWidth: 2,
    borderColor: "#888",
    borderRadius: 32,
    borderStyle: "solid",
    marginTop: 4,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    gap: 32,
    marginVertical: 16,
  },
  input: {
    textAlign: "center",
    borderWidth: 2,
    borderStyle: "dotted",
    height: 48,
    marginBottom: 8,
  },
  scrollList: {
    maxHeight: 60,
  },
  scrollListContent: {
    alignItems: "center",
    flexDirection: "row",
  },
  slotButton: {
    width: 100,
    height: 32,
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  slotButtonText: {
    fontSize: 14,
  },
  selectSlot: {
    backgroundColor: "#ffeaea",
    borderColor: "red",
  },
  unSelectedSlot: {
    backgroundColor: "#eef6ff",
    borderColor: "blue",
  },
});

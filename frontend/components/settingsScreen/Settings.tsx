import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CheckBox } from "@rneui/themed";
import { GeneralModal } from "../commonComponents/GeneralModal";
import {
  AppSettings,
  loadSettings,
  saveSettings,
} from "../../utilities/settingsStorage";

export default function Settings() {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    showMassagePrompt: false,
  });

  // Load settings from storage when modal is shown
  useEffect(() => {
    async function fetchSettings() {
      const settings = await loadSettings();
      console.log("Loaded settings:", settings);
      setSettings(settings);
    }
    if (showSettings) {
      fetchSettings();
    }
  }, [showSettings]);

  const saveOptions = useCallback(async () => {
    await saveSettings(settings);
    setShowSettings(false);
  }, [settings]);

  return (
    <>
      <TouchableOpacity
        style={styles.gearButton}
        onPress={() => setShowSettings(true)}
        accessibilityLabel="Settings"
      >
        <Ionicons name="settings-outline" size={24} color="#AAAAFF" />
      </TouchableOpacity>
      <GeneralModal
        text={"Settings"}
        visible={showSettings}
        onConfirm={saveOptions}
        onClose={() => setShowSettings(false)}
        confirmText="Apply"
        cancelText="Cancel"
      >
        <View style={styles.container}>
          <CheckBox
            disabled={false}
            checked={settings.showMassagePrompt}
            onPress={() => {
              setSettings((prev) => ({
                ...prev,
                showMassagePrompt: !prev.showMassagePrompt,
              }));
            }}
            title={"Daily prompt to record time spent massaging every morning"}
            checkedColor={"#333"}
            uncheckedColor={"#333"}
            containerStyle={styles.checkboxContainer}
          />
        </View>
      </GeneralModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  checkboxContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
  },
  gearButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});

import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CheckBox } from "@rneui/themed";
import { GeneralModal } from "../commonComponents/GeneralModal";
import {
  AppSettings,
  loadSettings,
  saveSettings,
} from "../../utilities/settingsStorage";
import MassageLogPopUp from "../exerciseLog/popups/MassageLogPopUp";

export default function Settings() {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    showMassagePrompt: false,
  });
  const [showMassagesPopUp, setShowMassagesPopUp] = useState(false);

  // Load settings from storage when modal is shown
  useEffect(() => {
    async function fetchSettings() {
      const settings = await loadSettings();
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
        style={styles.settingsButton}
        onPress={() => {
          setShowSettings(true);
          setShowMassagesPopUp(false);
        }}
        accessibilityLabel="Settings"
      >
        <Ionicons name="settings-outline" size={24} color="#AAAAFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => {
          setShowSettings(false);
          setShowMassagesPopUp(true);
        }}
        accessibilityLabel="Settings"
      >
        <Ionicons name="hand-left-outline" size={24} color="#AAAAFF" />
      </TouchableOpacity>
      {showMassagesPopUp && !showSettings && (
        <MassageLogPopUp
          showModalAlways
          onClose={() => {
            setShowMassagesPopUp(false);
          }}
        />
      )}
      {showSettings && !showMassagesPopUp && (
        <GeneralModal
          text={"Settings"}
          visible={showSettings}
          onConfirm={saveOptions}
          onClose={() => setShowSettings(false)}
          confirmText="Apply"
          cancelText="Cancel"
        >
          <View style={styles.container}>
            <View style={styles.underline} />

            <CheckBox
              disabled={false}
              checked={settings.showMassagePrompt}
              onPress={() => {
                setSettings((prev) => ({
                  ...prev,
                  showMassagePrompt: !prev.showMassagePrompt,
                }));
              }}
              title={
                "Daily prompt in the morning to record time spent massaging"
              }
              checkedColor={"#333"}
              uncheckedColor={"#333"}
              containerStyle={styles.checkboxContainer}
            />
            <View style={styles.underline} />
          </View>
        </GeneralModal>
      )}
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
  settingsButton: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  massageButton: {
    color: "#AAAAFF",
  },
  underline: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginVertical: 8,
  },
});

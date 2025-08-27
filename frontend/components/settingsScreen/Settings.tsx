import React, { useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CheckBox } from "@rneui/themed";
import { GeneralModal } from "../commonComponents/GeneralModal";

export default function Settings() {
  const [showSettings, setShowSettings] = useState(false);

  const saveOptions = useCallback(() => {
    // Placeholder: implement saving logic here
    console.log("Options saved!");
    setShowSettings(false);
  }, []);

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
            checked={false}
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

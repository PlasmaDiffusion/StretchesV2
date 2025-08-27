import React from "react";
import { View, StyleSheet } from "react-native";
import { HeadingText } from "../commonComponents/HeadingText";
import { CheckBox } from "@rneui/themed";

export default function Settings() {
  return (
    <View style={styles.container}>
      <HeadingText>Settings</HeadingText>
      <CheckBox
        disabled={false}
        checked={false}
        title={"Daily prompt to record any time spent massaging every morning"}
        checkedColor={"#333"}
        uncheckedColor={"#333"}
        containerStyle={styles.checkboxContainer}
      />
    </View>
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
});

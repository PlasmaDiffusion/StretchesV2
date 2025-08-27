import React from "react";
import { Views } from "../../interfaces/views";
import { View, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import NavButton from "./NavButton";
import { useNavBarStore } from "../../stores/navBarStore";
import { Ionicons } from "@expo/vector-icons"; // or 'react-native-vector-icons/Ionicons'

interface Props {
  currentView: Views;
  setCurrentView: (view: Views) => void;
}

const statusBarColours = [
  "#0000EE", //blue
  "#11ddff", //light blue
];

function NavBar({ currentView, setCurrentView }: Props) {
  const showNavBar = useNavBarStore((state) => state.showNavBar);

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={statusBarColours[currentView]}
      />
      {showNavBar && (
        <>
          <NavButton
            text={"Stretch Screen"}
            isCurrentView={currentView === Views.STRETCH_SCREEN}
            onPress={() => {
              setCurrentView(Views.STRETCH_SCREEN);
            }}
          />
          <NavButton
            text={"Exercise Log"}
            isCurrentView={currentView === Views.EXERCISE_LOG}
            onPress={() => {
              setCurrentView(Views.EXERCISE_LOG);
            }}
          />
          <TouchableOpacity
            style={styles.gearButton}
            onPress={() => setCurrentView(Views.SETTINGS)}
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings-outline" size={28} color="#AAAAFF" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  gearButton: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
});

export default NavBar;

import React from "react";
import { Views } from "../../interfaces/views";
import { View, StyleSheet, StatusBar } from "react-native";
import NavButton from "./NavButton";
import { useNavBarStore } from "../../stores/navBarStore";

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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
  },
});

export default NavBar;

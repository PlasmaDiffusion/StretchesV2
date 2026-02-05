import React from "react";
import { StyleSheet, ScrollView, SafeAreaView, Text } from "react-native";
import { useState } from "react";
import ExerciseLogsScreen from "./components/exerciseLog/ExerciseLogsScreen";
import { Views } from "./interfaces/views";
import NavBar from "./components/navBar/NavBar";
import StretchScreen from "./components/stretchScreen/StretchScreen";
import MassageLogPopUp from "./components/exerciseLog/popups/MassageLogPopUp";
import PhysioAdviceScreen from "./components/physioAdvice/PhysioAdviceScreen";

export default function App() {
  const [currentView, setCurrentView] = useState(Views.STRETCH_SCREEN);

  if (currentView !== Views.STRETCH_SCREEN) {
    return (
      <SafeAreaView style={styles.scrollViewContainer}>
        <NavBar currentView={currentView} setCurrentView={setCurrentView} />
        <ScrollView>
          {currentView === Views.EXERCISE_LOG && <ExerciseLogsScreen />}
          {currentView === Views.ADVICE_SCREEN && <PhysioAdviceScreen />}
        </ScrollView>
      </SafeAreaView>
    );
  }
  

  //Stretch screen is the default view that has a daily pop up to log any general massages you did for the day
  return (
    <SafeAreaView style={styles.container}>
      <NavBar currentView={currentView} setCurrentView={setCurrentView} />
      <StretchScreen />
      <MassageLogPopUp />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    borderColor: "#aaa",

    borderWidth: 1,
    borderRadius: 8,
  },
  scrollViewContainer: {
    flex: 1,
    backgroundColor: "#fee",
    margin: 8,
    borderColor: "#aaa",

    borderWidth: 1,
    borderRadius: 8,
  },
});

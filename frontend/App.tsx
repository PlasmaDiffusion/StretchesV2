import React from "react";
import { StyleSheet, ScrollView, SafeAreaView, Text } from "react-native";
import { useState } from "react";
import ExerciseLogsScreen from "./components/exerciseLog/ExerciseLogsScreen";
import { Views } from "./interfaces/views";
import NavBar from "./components/navBar/NavBar";
import StretchScreen from "./components/stretchScreen/StretchScreen";
import MassageLogPopUp from "./components/exerciseLog/popups/MassageLogPopUp";

export default function App() {
  const [currentView, setCurrentView] = useState(Views.STRETCH_SCREEN);

  if (currentView === Views.EXERCISE_LOG) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <NavBar currentView={currentView} setCurrentView={setCurrentView} />
          <ExerciseLogsScreen />
        </ScrollView>
      </SafeAreaView>
    );
  }

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
  scrollViewContent: {},
});

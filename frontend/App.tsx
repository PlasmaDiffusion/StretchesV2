import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import StretchScreen from "./components/stretchScreen/StretchScreen";
import ExerciseLogsScreen from "./components/exerciseLog/ExerciseLogsScreen";
import MassageLogPopUp from "./components/exerciseLog/popups/MassageLogPopUp";
import { SafeAreaView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color }) => {
              let iconName = "help";
              if (route.name === "Stretch") iconName = "body-outline";
              if (route.name === "Log") iconName = "list-outline";
              return <Ionicons name={iconName} size={20} color={color} />;
            },
            tabBarShowIcon: true,
          })}
        >
          <Tab.Screen name="Stretch" component={StretchScreen} />
          <Tab.Screen name="Log" component={ExerciseLogsScreen} />
        </Tab.Navigator>
        <MassageLogPopUp />
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 8,
  },
});

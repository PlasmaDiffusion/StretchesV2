import React from "react";
import { ScrollView, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ExerciseLogsScreen from "./components/exerciseLog/ExerciseLogsScreen";
import StretchScreen from "./components/stretchScreen/StretchScreen";
import MassageLogPopUp from "./components/exerciseLog/popups/MassageLogPopUp";
import PhysioAdviceScreen from "./components/physioAdvice/PhysioAdviceScreen";
import Settings from "./components/settingsScreen/Settings";
import { useNavBarStore } from "./stores/navBarStore";

const Tab = createBottomTabNavigator();

function StretchTab() {
  return (
    <View style={{ flex: 1 }}>
      <StretchScreen />
      <MassageLogPopUp />
    </View>
  );
}

function ExerciseLogTab() {
  return (
    <ScrollView>
      <ExerciseLogsScreen />
    </ScrollView>
  );
}

function AdviceTab() {
  return (
    <ScrollView>
      <PhysioAdviceScreen />
    </ScrollView>
  );
}

export default function App() {
  const showNavBar = useNavBarStore((state) => state.showNavBar);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: showNavBar ? undefined : { display: "none" },
            headerRight: () => <Settings />,
          }}
        >
          <Tab.Screen
            name="Stretch"
            component={StretchTab}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="body-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Exercise Log"
            component={ExerciseLogTab}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="clipboard-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Advice"
            component={AdviceTab}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="information-circle-outline" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

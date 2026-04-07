import React from "react";
import { ScrollView, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ExerciseLogsScreen from "./components/exerciseLog/ExerciseLogsScreen";
import StretchScreen from "./components/stretchScreen/StretchScreen";
import MassageLogPopUp from "./components/exerciseLog/popups/MassageLogPopUp";
import PhysioAdviceScreen from "./components/physioAdvice/PhysioAdviceScreen";
import Settings from "./components/settingsScreen/Settings";
import ModelViewerScreen from "./components/modelViewer/ModelViewerScreen";
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
          <Tab.Screen name="Stretch" component={StretchTab} />
          <Tab.Screen name="Exercise Log" component={ExerciseLogTab} />
          <Tab.Screen name="Advice" component={AdviceTab} />
          <Tab.Screen name="3D Viewer" component={ModelViewerScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

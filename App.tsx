import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { StretchItem } from "./components/StretchItem";
import Slider from "react-native-a11y-slider";
import { StartButtonAndTimer } from "./components/StartButtonAndTimer";
import { useState } from "react";

export interface Stretch {
  name: string;
  color: string;
  totalStretchTime: number;
}

const stretches: Stretch[] = [
  { name: "Hooklying Pos 1", color: "lightcoral", totalStretchTime: 60 },
  { name: "Hooklying Pos 2", color: "salmon", totalStretchTime: 60 },
  { name: "Knee-Chest 1", color: "pink", totalStretchTime: 60 },
  { name: "Knee-Chest 2", color: "lightseagreen", totalStretchTime: 60 },
  { name: "Figure Four 1", color: "aqua", totalStretchTime: 60 },
  { name: "Figure Four 2", color: "limegreen", totalStretchTime: 60 },
  { name: "Stir Pot", color: "green", totalStretchTime: 60 },
  { name: "Frog Stretch", color: "#58D68D", totalStretchTime: 60 },
  { name: "Windshield", color: "yellow", totalStretchTime: 60 },
  { name: "Heard-Knee 1", color: "orange", totalStretchTime: 60 },
  { name: "Head-Knee 2", color: "#990F02", totalStretchTime: 60 },
  { name: "Butterfly", color: "orange", totalStretchTime: 60 },
  { name: "Wipers Sitting", color: "violet", totalStretchTime: 60 },
  { name: "Child Pose", color: "purple", totalStretchTime: 60 },
];

export default function App() {
  const [time, setTime] = useState(-1);
  const [currentStretchIndex, setCurrentStretchIndex] = useState(-1);

  return (
    <SafeAreaView style={styles.container}>
      <StartButtonAndTimer
        currentTime={time}
        currentStretch={stretches[currentStretchIndex]}
        incrementTime={() => {
          setTime(time + 1);
        }}
        goToNextStretch={() => {
          setCurrentStretchIndex(currentStretchIndex + 1);
        }}
      />
      {time == -1 ? (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text>Select Stretches</Text>
          {stretches.map((stretch, index) => (
            <View style={styles.row}>
              <StretchItem name={stretch.name} color={stretch.color} />
              <Slider
                style={styles.slider}
                min={0}
                max={240}
                values={[60]}
                increment={30}
                labelStyle={{ marginTop: 15 }}
              />
            </View>
          ))}
          <StatusBar style="auto" />
        </ScrollView>
      ) : (
        <>
          {/* Dummy slider used as timer */}
          <Slider
            style={styles.slider}
            min={0}
            max={100}
            values={[
              (time / stretches[currentStretchIndex].totalStretchTime) * 100,
            ]}
            increment={1}
            labelStyle={{ marginTop: 15 }}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

    margin: 24,
    borderWidth: 1,
    borderRadius: 8,
  },
  scrollViewContent: {},
  row: {
    display: "flex",
    flexDirection: "row",
    width: "80%",
    alignItems: "center",
  },
  slider: {
    width: "50%",
    height: "150%",
  },
});

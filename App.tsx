import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { StretchCheckbox } from "./components/StretchCheckbox";
import Slider from "react-native-a11y-slider";
import { StartButtonAndTimer } from "./components/StartButtonAndTimer";
import { useEffect, useState } from "react";
import { CurrentStretchData } from "./components/CurrentStretchData";

export interface Stretch {
  name: string;
  color: string;
  totalStretchTime: number;
  enabled?: boolean;
}

const defaultStretches: Stretch[] = [
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
  const [time, setTime] = useState(60);
  const [currentStretchIndex, setCurrentStretchIndex] = useState(-1);
  const [isStretching, setIsStretching] = useState(false);
  const [stretches, setStretches] = useState<Stretch[]>(defaultStretches);

  return (
    <SafeAreaView style={styles.container}>
      <StartButtonAndTimer
        currentTime={time}
        currentStretch={stretches[currentStretchIndex]}
        incrementTime={() => {
          setTime(time - 1);
        }}
        goToNextStretch={() => {
          if (currentStretchIndex + 1 >= stretches.length) {
            setIsStretching(false);
          } else {
            for (let i = currentStretchIndex + 1; i < stretches.length; i++) {
              if (stretches[i].enabled) {
                setIsStretching(true);
                setTime(stretches[i].totalStretchTime);
                setCurrentStretchIndex(i);
                break;
              }
            }
          }
        }}
      />
      {!isStretching ? (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text>Select Stretches</Text>
          {stretches.map((stretch, index) => (
            <View style={styles.row} key={"s" + index}>
              <StretchCheckbox
                stretch={stretch}
                setCheckbox={(isChecked) => {
                  const updatedStretchArray = stretches;
                  updatedStretchArray[index].enabled = isChecked;
                  setStretches([...updatedStretchArray]);
                }}
              />
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
        <View>
          <CurrentStretchData
            stretch={stretches[currentStretchIndex]}
            time={time}
          />
        </View>
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

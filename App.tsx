import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { StretchCheckbox } from "./components/StretchCheckbox";
import Slider from "react-native-a11y-slider";
import { StartButtonAndTimer } from "./components/StartButtonAndTimer";
import { useState } from "react";
import { CurrentStretchData } from "./components/CurrentStretchData";
import { Stretch, stretchList } from "./utilities/stretchList";

export default function App() {
  const [time, setTime] = useState(60);
  const [currentStretchIndex, setCurrentStretchIndex] = useState(-1);
  const [isStretching, setIsStretching] = useState(false);
  const [stretches, setStretches] = useState<Stretch[]>(stretchList);

  return (
    <SafeAreaView style={styles.container}>
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
                values={[stretch.totalStretchTime]}
                increment={30}
                labelStyle={{ marginTop: 15 }}
                onChange={(values: number[]) => {
                  const updatedStretchArray = stretches;
                  updatedStretchArray[index].totalStretchTime = values[0];
                  setStretches([...updatedStretchArray]);
                }}
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
      <StartButtonAndTimer
        started={isStretching}
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

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { StretchCheckbox } from "./components/StretchCheckbox";
import Slider from "react-native-a11y-slider";
import { StartButtonAndTimer } from "./components/StartButtonAndTimer";
import { useState } from "react";
import { CurrentStretchData } from "./components/CurrentStretchData";
import { Stretch, stretchList } from "./utilities/stretchList";
import { EndButton } from "./components/EndButton";

export default function App() {
  const [time, setTime] = useState(60);
  const [currentStretchIndex, setCurrentStretchIndex] = useState(-1);
  const [isStretching, setIsStretching] = useState(false);
  const [stretches, setStretches] = useState<Stretch[]>(stretchList);

  function endStretchSession() {
    setTime(0);
    setIsStretching(false);
    setCurrentStretchIndex(-1);
  }

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
          <EndButton onPress={endStretchSession} />
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
            endStretchSession();
          } else {
            // Go to next enabled stretch
            let continuing = false;
            for (let i = currentStretchIndex + 1; i < stretches.length; i++) {
              if (stretches[i].enabled) {
                setIsStretching(true);
                setTime(stretches[i].totalStretchTime);
                setCurrentStretchIndex(i);
                continuing = true;
                break;
              }
            }
            if (!continuing) {
              endStretchSession();
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

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Vibration,
  Button,
} from "react-native";
import { StretchCheckbox } from "./StretchCheckbox";
import Slider from "react-native-a11y-slider";
import { StartButtonAndTimer } from "./StartButtonAndTimer";
import { useState } from "react";
import { CurrentStretchData } from "./CurrentStretchData";
import { Stretch, stretchList } from "../../interfaces/stretchList";
import { EndButton } from "./EndButton";
import SaveAndLoad from "./savingStretches/SaveAndLoad";
import StretchEditForm from "./savingStretches/StretchEditForm";
import { saveExercisesForCurrentDayToLog } from "../../utilities/logRecording";
import { HeadingText } from "../commonComponents/HeadingText";
import React from "react";

function StretchScreen() {
  const [time, setTime] = useState(60);
  const [currentStretchIndex, setCurrentStretchIndex] = useState(-1);
  const [isStretching, setIsStretching] = useState(false);
  const [stretches, setStretches] = useState<Stretch[]>(stretchList);
  const [buttonEnablesAll, setButtonEnablesAll] = useState(false);

  const [editIsOn, setEditIsOn] = useState(false);
  const [editingStretchIndex, setEditingStretchIndex] = useState(-1);

  function endStretchSession() {
    setTime(0);
    setIsStretching(false);
    setCurrentStretchIndex(-1);
  }

  if (editingStretchIndex >= 0 && stretches.length > 0 && editIsOn) {
    return (
      <>
        <StretchEditForm
          stretch={stretches[editingStretchIndex]}
          index={editingStretchIndex}
          prevStretches={stretches}
          setStretches={setStretches}
          onBackPressed={() => {
            setEditingStretchIndex(-1);
          }}
        />
      </>
    );
  }

  return (
    <>
      {!isStretching ? (
        <>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <HeadingText>Stretches List</HeadingText>
            <SaveAndLoad
              currentStretches={stretches}
              setStretches={(loadedStretches) => {
                setStretches([...loadedStretches]);
              }}
            />
            <HeadingText size="small" verticalSpacing={16}>
              {editIsOn ? "Edit Stretches" : "Stretch Select"}
            </HeadingText>

            <View style={styles.editButton}>
              <Button
                title={editIsOn ? "Back To Stretch Select" : "Edit Stretches"}
                onPress={() => setEditIsOn(!editIsOn)}
              />
            </View>
            {stretches.map((stretch, index) => (
              <View style={styles.row} key={"s" + index}>
                <StretchCheckbox
                  stretch={stretch}
                  editing={editIsOn}
                  setCheckbox={(isChecked) => {
                    if (editIsOn) {
                      // Edit mode turns checkbox into an edit button
                      setEditingStretchIndex(index);
                    } else {
                      // Regular check box
                      const updatedStretchArray = stretches;
                      updatedStretchArray[index].enabled = isChecked;
                      setStretches([...updatedStretchArray]);
                    }
                  }}
                />
                {!editIsOn && (
                  <Slider
                    style={styles.slider}
                    min={0}
                    max={240}
                    values={[stretch.totalStretchTime]}
                    increment={30}
                    labelStyle={styles.sliderLabel}
                    onChange={(values: number[]) => {
                      const updatedStretchArray = stretches;
                      updatedStretchArray[index].totalStretchTime = values[0];
                      setStretches([...updatedStretchArray]);
                    }}
                  />
                )}
              </View>
            ))}
            {!editIsOn && (
              <View style={styles.enableAll}>
                <Button
                  title={buttonEnablesAll ? "Enable All" : "Disable All"}
                  onPress={() => {
                    const stretchCopy = [...stretches];
                    stretchCopy.forEach((stretch) => {
                      stretch.enabled = buttonEnablesAll;
                    });
                    setStretches([...stretchCopy]);
                    setButtonEnablesAll(!buttonEnablesAll);
                  }}
                />
              </View>
            )}
          </ScrollView>
        </>
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
        goToNextStretch={async () => {
          // Stretch complete! Save the stretch you just completed to the log.
          if (currentStretchIndex >= 0) {
            await saveExercisesForCurrentDayToLog(
              stretches,
              currentStretchIndex
            );
          }
          Vibration.vibrate();
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
    </>
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
  sliderLabel: {
    marginLeft: 10,
    marginTop: 60,
    borderRadius: 16,
  },
  prompt: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 24,
    marginTop: 24,
  },
  enableAll: {
    width: 150,
    textAlign: "center",
    alignSelf: "center",
    marginVertical: 24,
  },
  editButton: {
    display: "flex",
    alignItems: "center",
  },
});

export default StretchScreen;

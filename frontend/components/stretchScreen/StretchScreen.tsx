import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Vibration,
  Button,
  TouchableOpacity,
  Platform,
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
import { useNavBarStore } from "../../stores/navBarStore";
import UpDownArrows from "./UpDownArrows";
import { ExtraStretchButtons } from "./ExtraStretchButtons";

const MAX_TIME_PER_STRETCH = 240;

function StretchScreen() {
  const [time, setTime] = useState(60);
  const [currentStretchIndex, setCurrentStretchIndex] = useState(-1);
  const [isStretching, setIsStretching] = useState(false);
  const [stretches, setStretches] = useState<Stretch[]>(stretchList);
  const [loadedPresetName, setLoadedPresetName] = useState("");

  const [buttonEnablesAll, setButtonEnablesAll] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const [editIsOn, setEditIsOn] = useState(false);
  const [editingStretchIndex, setEditingStretchIndex] = useState(-1);

  const setShowNavBar = useNavBarStore((state) => state.setShowNavBar);

  function endStretchSession() {
    setTime(0);
    setIsStretching(false);
    setCurrentStretchIndex(-1);
    setShowNavBar(true);
  }

  if (editingStretchIndex >= 0 && stretches.length > 0 && editIsOn) {
    return (
      <View style={styles.container}>
        <StretchEditForm
          stretch={stretches[editingStretchIndex]}
          index={editingStretchIndex}
          prevStretches={stretches}
          setStretches={setStretches}
          onBackPressed={() => {
            setEditingStretchIndex(-1);
          }}
        />
      </View>
    );
  }

  return (
    <>
      {!isStretching ? (
        <>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            scrollEnabled={scrollEnabled}
          >
            <HeadingText>{`${loadedPresetName} Stretches`}</HeadingText>
            <SaveAndLoad
              currentStretches={stretches}
              setStretches={(loadedStretches, presetName) => {
                setStretches([...loadedStretches]);
                setLoadedPresetName(presetName);
              }}
            />
            <HeadingText size="small" verticalSpacing={16}>
              {editIsOn ? "Edit Stretches" : "Select Stretches"}
            </HeadingText>

            <View style={styles.editButton}>
              <Button
                title={editIsOn ? "Back To Stretch Select" : "Edit Stretches"}
                onPress={() => setEditIsOn(!editIsOn)}
              />
            </View>
            {stretches.map((stretch, index) => (
              <View
                style={[styles.row, editIsOn && styles.bottomBorder]}
                key={"s" + index}
              >
                <StretchCheckbox
                  stretch={stretch}
                  editing={editIsOn}
                  setCheckbox={(isChecked) => {
                    if (editIsOn) {
                      setEditingStretchIndex(index);
                    } else {
                      const updatedStretchArray = stretches;
                      updatedStretchArray[index].enabled = isChecked;
                      setStretches([...updatedStretchArray]);
                    }
                  }}
                />
                {/* Up/Down arrows for edit mode */}
                {editIsOn && (
                  <UpDownArrows
                    index={index}
                    stretches={stretches}
                    setStretches={setStretches}
                  />
                )}
                {!editIsOn && (
                  <Slider
                    style={styles.slider}
                    min={0}
                    max={MAX_TIME_PER_STRETCH}
                    values={[stretch.totalStretchTime]}
                    increment={30}
                    labelStyle={styles.sliderLabel}
                    onChange={async (values: number[]) => {
                      const updatedStretchArray = stretches;
                      updatedStretchArray[index].totalStretchTime = values[0];
                      setStretches([...updatedStretchArray]);

                      // onSlideComplete is inconsistent on iOS, so disable scrolling briefly on any change
                      if (scrollEnabled && Platform.OS === "ios") {
                        setScrollEnabled(false);
                        await new Promise((r) => setTimeout(r, 100));
                        setScrollEnabled(true);
                      }
                    }}
                  />
                )}
              </View>
            ))}
            {!editIsOn && (
              <ExtraStretchButtons
                stretches={stretches}
                setStretches={setStretches}
                buttonEnablesAll={buttonEnablesAll}
                setButtonEnablesAll={setButtonEnablesAll}
                maxTimePerStretch={MAX_TIME_PER_STRETCH}
                minTimePerStretchAboveZero={30}
              />
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
  bottomBorder: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
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
  editButton: {
    display: "flex",
    alignItems: "center",
  },
  arrowsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
});

export default StretchScreen;

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { StretchItem } from "./components/StretchItem";
import Slider from "react-native-a11y-slider";

const stretches = [
  { name: "Hooklying Pos 1", color: "red" },
  { name: "Hooklying Pos 2", color: "salmon" },
  { name: "Knee-Chest 1", color: "orange" },
  { name: "Knee-Chest 2", color: "orange" },
  { name: "Figure Four 1", color: "orange" },
  { name: "Figure Four 2", color: "orange" },
  { name: "Stir Pot", color: "orange" },
  { name: "Frog Stretch", color: "orange" },
  { name: "Windshield", color: "orange" },
  { name: "Heard-Knee 1", color: "orange" },
  { name: "Head-Knee 2", color: "orange" },
  { name: "Butterfly", color: "orange" },
  { name: "Wipers Sitting", color: "orange" },
  { name: "Child Pose", color: "orange" },
];

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
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
  scrollViewContent:{
  },
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

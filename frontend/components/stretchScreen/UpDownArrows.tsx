import React from "react";
import { View, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface UpDownArrowsProps {
  index: number;
  stretches: any[];
  setStretches: (stretches: any[]) => void;
}

export default function UpDownArrows({
  index,
  stretches,
  setStretches,
}: UpDownArrowsProps) {
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 8,
      }}
    >
      <TouchableOpacity
        disabled={index === 0}
        onPress={() => {
          if (index > 0) {
            const newStretches = [...stretches];
            [newStretches[index - 1], newStretches[index]] = [
              newStretches[index],
              newStretches[index - 1],
            ];
            setStretches(newStretches);
          }
        }}
      >
        <AntDesign
          name="arrowup"
          size={24}
          color={index === 0 ? "#ccc" : "#333"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={index === stretches.length - 1}
        onPress={() => {
          if (index < stretches.length - 1) {
            const newStretches = [...stretches];
            [newStretches[index + 1], newStretches[index]] = [
              newStretches[index],
              newStretches[index + 1],
            ];
            setStretches(newStretches);
          }
        }}
      >
        <AntDesign
          name="arrowdown"
          size={24}
          color={index === stretches.length - 1 ? "#ccc" : "#333"}
        />
      </TouchableOpacity>
    </View>
  );
}

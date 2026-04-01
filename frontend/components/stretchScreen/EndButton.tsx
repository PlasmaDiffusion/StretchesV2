import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { GeneralModal } from "../commonComponents/GeneralModal";
import React from "react";

interface Props {
  onPress: () => any;
}

export function EndButton({ onPress }: Props) {
  const [showEndModal, setShowEndModal] = useState(false);

  return (
    <>
      <GeneralModal
        visible={showEndModal}
        text={"End stretch session?"}
        onConfirm={onPress}
        onClose={() => {
          setShowEndModal(false);
        }}
      />
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            setShowEndModal(true);
          }}
          title={"X"}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 48,
    height: 48,
    display: "flex",
    alignSelf: "flex-end",
    top: -120,
  },
  modalContainer: {
    width: 128,
  }
});

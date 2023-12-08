import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { GeneralModal } from "./sharedComponents/GeneralModal";

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
    width: 32,
    height: 32,
    display: "flex",
    alignSelf: "flex-end",
    top: -190,
  },
});

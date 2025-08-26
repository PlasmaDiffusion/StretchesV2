import React from "react";
import { Text, StyleSheet, Button, View } from "react-native";
import Modal from "react-native-modal";

interface Props {
  visible: boolean;
  text: string;
  onConfirm?: () => any;
  onClose: () => any;
  children?: React.ReactNode;
}

export function GeneralModal({ text, visible, onConfirm, onClose, children }: Props) {
  return (
    <Modal style={styles.modal} isVisible={visible} onDismiss={onClose}>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
        {children}
        <View style={styles.buttonRow}>
          <View style={styles.button}>
            {onConfirm && <Button title="Yes" onPress={onConfirm}></Button>}
          </View>
          <View style={styles.button}>
            <Button
              title={onConfirm ? "No" : "Okay"}
              onPress={onClose}
            ></Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 128,
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 32,
  },
  modal: {},
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    gap: 30,
    justifyContent: "center",
  },
  button: { width: 128 },
  text: { fontSize: 24, alignSelf: "center", marginBottom: 32 },
});

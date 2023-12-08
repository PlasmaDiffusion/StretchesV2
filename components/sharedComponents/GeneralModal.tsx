import { Modal, Text, StyleSheet, Button, View } from "react-native";

interface Props {
  visible: boolean;
  text: string;
  onConfirm?: () => any;
  onClose: () => any;
}

export function GeneralModal({ text, visible, onConfirm, onClose }: Props) {
  return (
    <View style={styles.container}>
      <Modal
        style={styles.modal}
        visible={visible}
        onRequestClose={onClose}
        onDismiss={onClose}
        
      >
        <Text style={styles.text}>{text}</Text>
        {onConfirm && <Button title="Yes" onPress={onConfirm}></Button>}
        <Button title={onConfirm ? "No" : "Okay"} onPress={onClose}></Button>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginTop: 128},
  modal: { },
  text: { fontSize: 24, alignSelf: "center" },
});

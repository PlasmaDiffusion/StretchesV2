import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { HeadingText } from "../commonComponents/HeadingText";
import { PrimaryButton, SecondaryButton } from "../commonComponents/CustomButton";
import { GeneralModal } from "../commonComponents/GeneralModal";
import {
  loadAdviceSessions,
  deleteAdviceSession,
  AdviceSession,
  AdviceItem,
} from "../../utilities/adviceStorage";

interface Props {
  onLoad: (item: AdviceItem) => void;
}

export default function PreviousPhysioAdvice({ onLoad }: Props) {
  const [sessions, setSessions] = useState<AdviceSession[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const refreshSessions = useCallback(async () => {
    const loaded = await loadAdviceSessions();
    setSessions(loaded);
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const handleLoad = useCallback(() => {
    if (selectedIndex === null) return;
    const session = sessions[selectedIndex];
    if (!session.advice.length) return;
    onLoad(session.advice[0]);
  }, [selectedIndex, sessions, onLoad]);

  const handleDelete = useCallback(async () => {
    if (selectedIndex === null) return;
    await deleteAdviceSession(selectedIndex);
    setSelectedIndex(null);
    setShowConfirm(false);
    await refreshSessions();
  }, [selectedIndex, refreshSessions]);

  if (sessions.length === 0) return null;

  return (
    <View style={styles.container}>
      <HeadingText size="small" verticalSpacing={8}>Previous Responses</HeadingText>
      <Dropdown
        style={styles.dropdown}
        data={sessions.map((s, i) => ({ label: s.title, value: i }))}
        labelField="label"
        valueField="value"
        placeholder="Select a previous response..."
        value={selectedIndex}
        onChange={(item) => setSelectedIndex(item.value)}
      />
      <View style={styles.buttons}>
        <View style={styles.buttonWrapper}>
          <PrimaryButton text="Load" onPress={handleLoad} color="#007AFF" />
        </View>
        <View style={styles.buttonWrapper}>
          <SecondaryButton text="Delete" onPress={() => setShowConfirm(true)} />
        </View>
      </View>
      <GeneralModal
        visible={showConfirm}
        text="Are you sure you want to delete this response?"
        onConfirm={handleDelete}
        onClose={() => setShowConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  buttonWrapper: {
    flex: 1,
  },
});

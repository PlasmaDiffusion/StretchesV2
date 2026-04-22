import React, { useState, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SecondaryButton } from "../commonComponents/CustomButton";
import { GeneralModal } from "../commonComponents/GeneralModal";
import { deleteAdviceSession, AdviceSession } from "../../utilities/adviceStorage";

interface Props {
  sessions: AdviceSession[];
  currentSessionIndex: number | null;
  onLoad: (session: AdviceSession, index: number) => void;
  onNewChat: () => void;
  onSessionDeleted: (index: number) => void;
}

export default function PhysioAdviceSessions({
  sessions,
  currentSessionIndex,
  onLoad,
  onNewChat,
  onSessionDeleted,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelect = useCallback(
    (index: number) => {
      onLoad(sessions[index], index);
    },
    [sessions, onLoad]
  );

  const handleDelete = useCallback(async () => {
    if (currentSessionIndex === null) return;
    await deleteAdviceSession(currentSessionIndex);
    setShowConfirm(false);
    onSessionDeleted(currentSessionIndex);
  }, [currentSessionIndex, onSessionDeleted]);

  const dropdownData = sessions.map((s, i) => ({ label: s.title, value: i }));

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Dropdown
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          data={dropdownData}
          labelField="label"
          valueField="value"
          placeholder={sessions.length === 0 ? "No saved sessions" : "Load a previous session..."}
          value={currentSessionIndex}
          onChange={(item) => handleSelect(item.value)}
          disable={sessions.length === 0}
        />

        <TouchableOpacity style={styles.newChatButton} onPress={onNewChat}>
          <Text style={styles.newChatText}>+ New</Text>
        </TouchableOpacity>

        {currentSessionIndex !== null && (
          <SecondaryButton text="Delete" onPress={() => setShowConfirm(true)} />
        )}
      </View>

      <GeneralModal
        visible={showConfirm}
        text="Are you sure you want to delete this session?"
        onConfirm={handleDelete}
        onClose={() => setShowConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropdown: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fafafa",
  },
  dropdownContainer: {
    borderRadius: 8,
  },
  newChatButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e8f4ff",
    borderWidth: 1,
    borderColor: "#007AFF",
    flexShrink: 0,
  },
  newChatText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 13,
  },
});

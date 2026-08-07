import React, { useState, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SecondaryButton } from "../commonComponents/CustomButton";
import { GeneralModal } from "../commonComponents/GeneralModal";
import { deleteAdviceSession, updateAdviceSession, loadAdviceSessions, AdviceSession } from "../../utilities/adviceStorage";

interface Props {
  sessions: AdviceSession[];
  currentSessionIndex: number | null;
  onLoad: (session: AdviceSession, index: number) => void;
  onNewChat: () => void;
  onSessionDeleted: (index: number) => void;
  onSessionRenamed: () => void;
}

// Shows session management UI: load, rename, delete, and create new sessions to ask for advice.
export default function PhysioAdviceSessions({
  sessions,
  currentSessionIndex,
  onLoad,
  onNewChat,
  onSessionDeleted,
  onSessionRenamed,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [renameInput, setRenameInput] = useState("");

  const handleSelect = useCallback(
    (index: number) => {
      setRenameVisible(false);
      setRenameInput("");
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

  const handleRename = useCallback(async () => {
    if (currentSessionIndex === null) return;
    if (!renameVisible) {
      setRenameVisible(true);
      return;
    }
    if (!renameInput.trim()) return;
    const session = sessions[currentSessionIndex];
    await updateAdviceSession(currentSessionIndex, { ...session, title: renameInput.trim() });
    setRenameVisible(false);
    setRenameInput("");
    onSessionRenamed();
  }, [currentSessionIndex, renameVisible, renameInput, sessions, onSessionRenamed]);

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
          <View style={styles.sessionActions}>
            <SecondaryButton text="Rename" onPress={handleRename} marginVertical={2} />
            <SecondaryButton text="Delete" onPress={() => setShowConfirm(true)} marginVertical={2} />
          </View>
        )}
      </View>

      {renameVisible && currentSessionIndex !== null && (
        <TextInput
          style={styles.renameInput}
          placeholder="New session name..."
          value={renameInput}
          onChangeText={setRenameInput}
          autoFocus
        />
      )}

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
  sessionActions: {
    flexDirection: "column",
    gap: 0,
  },
  renameInput: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
});

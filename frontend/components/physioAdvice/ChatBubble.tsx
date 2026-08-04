import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChatMessage } from "../../utilities/adviceStorage";
import PhysioAdviceSummary from "./PhysioAdviceSummary";

interface Props {
  message: ChatMessage;
}

// A chat bubble for the Physio Advice screen (user's prompt and LLM's response)
export default function ChatBubble({ message }: Props) {
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const isUser = message.role === "user";

  return (
    <View style={[styles.row, isUser ? styles.userRow : styles.assistantRow]}>

      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userText : styles.assistantText,
          ]}
        >
          {message.content}
        </Text>

        {!isUser && message.extra_data && (
          <>
            {/* Show a short summary of what the LLM recommends or any info that could be useful to a physiotherapist */}
            <TouchableOpacity
              onPress={() => setSummaryExpanded((v) => !v)}
              style={styles.summaryToggle}
            >
              <Text style={styles.summaryToggleText}>
                {summaryExpanded ? "Hide summary ▲" : "Show summary ▼"}
              </Text>
            </TouchableOpacity>
            {summaryExpanded && (
              <View style={styles.summaryContainer}>
                <PhysioAdviceSummary extra_data={message.extra_data} />
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginVertical: 6,
    paddingHorizontal: 12,
    alignItems: "flex-end",
  },
  userRow: {
    justifyContent: "flex-end",
  },
  assistantRow: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    flexShrink: 0,
  },
  avatarText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  bubble: {
    maxWidth: "95%",
    borderRadius: 16,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "#f0f0f0",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  userText: {
    color: "white",
  },
  assistantText: {
    color: "#1a1a1a",
  },
  summaryToggle: {
    marginTop: 8,
  },
  summaryToggleText: {
    color: "#007AFF",
    fontSize: 13,
    fontWeight: "600",
  },
  summaryContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
  },
});

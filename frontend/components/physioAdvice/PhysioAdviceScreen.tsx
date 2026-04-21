import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useFetchPhysioAdvice, ConversationTurn } from "../../hooks/useFetchPhysioAdvice";
import PhysioAdviceCategory from "./PhysioAdviceCategory";
import PreviousPhysioAdvice from "./PreviousPhysioAdvice";
import ChatBubble from "./ChatBubble";
import { HeadingText } from "../commonComponents/HeadingText";
import {
  saveAdviceSession,
  updateAdviceSession,
  loadAdviceSessions,
  generateTitleFromPrompt,
  ChatMessage,
  AdviceSession,
} from "../../utilities/adviceStorage";

type AdviceType = "stretches" | "mental" | "misc_physiotherapy";

export default function PhysioAdviceScreen() {
  const { fetchAdvice, loading, error } = useFetchPhysioAdvice();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [adviceType, setAdviceType] = useState<AdviceType>("stretches");
  const [useRag, setUseRag] = useState(true);
  const [currentSessionIndex, setCurrentSessionIndex] = useState<number | null>(null);
  const [sessions, setSessions] = useState<AdviceSession[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const refreshSessions = useCallback(async () => {
    const loaded = await loadAdviceSessions();
    setSessions(loaded);
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const handleLoadSession = useCallback(
    (session: AdviceSession, index: number) => {
      setMessages(session.messages);
      setCurrentSessionIndex(index);
    },
    []
  );

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setCurrentSessionIndex(null);
  }, []);

  const handleSessionDeleted = useCallback(
    async (deletedIndex: number) => {
      await refreshSessions();
      if (currentSessionIndex === deletedIndex) {
        setMessages([]);
        setCurrentSessionIndex(null);
      } else if (currentSessionIndex !== null && currentSessionIndex > deletedIndex) {
        setCurrentSessionIndex(currentSessionIndex - 1);
      }
    },
    [currentSessionIndex, refreshSessions]
  );

  const handleSend = useCallback(async () => {
    const trimmed = inputMessage.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const optimisticMessages = [...messages, userMsg];
    setMessages(optimisticMessages);
    setInputMessage("");

    const history: ConversationTurn[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetchAdvice(trimmed, adviceType, useRag, history);
      const aiMsg: ChatMessage = {
        role: "assistant",
        content: response.message,
        extra_data: response.extra_data,
      };
      const finalMessages = [...optimisticMessages, aiMsg];
      setMessages(finalMessages);

      if (currentSessionIndex !== null) {
        const updatedSession: AdviceSession = {
          title: sessions[currentSessionIndex]?.title ?? generateTitleFromPrompt(trimmed),
          messages: finalMessages,
        };
        await updateAdviceSession(currentSessionIndex, updatedSession);
        await refreshSessions();
      } else {
        const newSession: AdviceSession = {
          title: generateTitleFromPrompt(trimmed),
          messages: finalMessages,
        };
        await saveAdviceSession(newSession);
        const updated = await loadAdviceSessions();
        setSessions(updated);
        setCurrentSessionIndex(updated.length - 1);
      }
    } catch {
      // Revert optimistic user message on error
      setMessages(messages);
    }
  }, [
    inputMessage,
    loading,
    messages,
    adviceType,
    useRag,
    fetchAdvice,
    currentSessionIndex,
    sessions,
    refreshSessions,
  ]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <HeadingText>Physiotherapy Advice</HeadingText>
        <View style={styles.headerActions}>
          <PreviousPhysioAdvice
            sessions={sessions}
            currentSessionIndex={currentSessionIndex}
            onLoad={handleLoadSession}
            onNewChat={handleNewChat}
            onSessionDeleted={handleSessionDeleted}
          />
        </View>
      </View>

      {/* Chat messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Ask a physiotherapy question below to get started.
            </Text>
          </View>
        )}
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} />
        ))}
        {loading && (
          <View style={styles.loadingRow}>
            <View style={styles.loadingBubble}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          </View>
        )}
        {error && !loading && (
          <View style={styles.errorRow}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}
      </ScrollView>

      {/* Input area */}
      <View style={styles.inputArea}>
        <PhysioAdviceCategory
          adviceType={adviceType}
          onAdviceTypeChange={setAdviceType}
        />

        <View style={styles.ragToggleRow}>
          <Switch value={useRag} onValueChange={setUseRag} />
          <Text style={styles.ragToggleLabel}>Use research articles</Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask a physio question..."
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
            maxHeight={100}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputMessage.trim() || loading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputMessage.trim() || loading}
          >
            <Text style={styles.sendButtonText}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  headerActions: {
    marginBottom: 8,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyStateText: {
    color: "#999",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
  },
  loadingRow: {
    paddingHorizontal: 12,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  loadingText: {
    color: "#666",
    fontSize: 14,
  },
  errorRow: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
  errorText: {
    color: "red",
    fontSize: 13,
  },
  inputArea: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    backgroundColor: "#fff",
  },
  ragToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  ragToggleLabel: {
    color: "#555",
    fontSize: 14,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: "#fafafa",
    textAlignVertical: "top",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  sendButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 22,
  },
});

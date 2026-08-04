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
} from "react-native";
import {
  useStreamPhysioAdvice,
  ConversationTurn,
  StreamStatus,
} from "../../hooks/useFetchPhysioAdvice";
import { StreamingProgressBar } from "./StreamingProgressBar";
import PhysioAdviceCategory from "./PhysioAdviceCategory";
import PhysioAdviceSessions from "./PhysioAdviceSessions";
import ChatBubble from "./ChatBubble";
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
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null);
  const { fetchAdviceStream, loading, error, cancel } =
    useStreamPhysioAdvice(setStreamStatus);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [adviceType, setAdviceType] = useState<AdviceType>("stretches");
  const [useRag, setUseRag] = useState(true);
  const [currentSessionIndex, setCurrentSessionIndex] = useState<number | null>(
    null
  );
  const [sessions, setSessions] = useState<AdviceSession[]>([]);
  const [bubblesHidden, setBubblesHidden] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const refreshSessions = useCallback(async () => {
    const loaded = await loadAdviceSessions();
    setSessions(loaded);
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (!bubblesHidden && contentHeight > 0) {
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      });
    }
  }, [bubblesHidden, contentHeight]);

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
      } else if (
        currentSessionIndex !== null &&
        currentSessionIndex > deletedIndex
      ) {
        setCurrentSessionIndex(currentSessionIndex - 1);
      }
    },
    [currentSessionIndex, refreshSessions]
  );

  const handleSend = useCallback(async () => {
    const trimmed = inputMessage.trim();
    if (!trimmed || loading) return;

    setBubblesHidden(false);
    setStreamStatus(null);

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const optimisticMessages = [...messages, userMsg];
    setMessages(optimisticMessages);
    setInputMessage("");

    const history: ConversationTurn[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetchAdviceStream(
        trimmed,
        adviceType,
        useRag,
        history
      );
      if (!response) return;

      const aiMsg: ChatMessage = {
        role: "assistant",
        content: response.message,
        extra_data: response.extra_data,
      };
      const finalMessages = [...optimisticMessages, aiMsg];
      setMessages(finalMessages);

      if (currentSessionIndex !== null) {
        const updatedSession: AdviceSession = {
          title:
            sessions[currentSessionIndex]?.title ??
            generateTitleFromPrompt(trimmed),
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
    fetchAdviceStream,
    currentSessionIndex,
    sessions,
    refreshSessions,
    setBubblesHidden,
    setStreamStatus,
  ]);

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        onContentSizeChange={(_, height) => {
          setContentHeight(height);
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* <HeadingText>Physiotherapy Advice</HeadingText> */}
          <View style={styles.headerActions}>
            <PhysioAdviceSessions
              sessions={sessions}
              currentSessionIndex={currentSessionIndex}
              onLoad={handleLoadSession}
              onNewChat={handleNewChat}
              onSessionDeleted={handleSessionDeleted}
              onSessionRenamed={refreshSessions}
            />
          </View>
        </View>

        {/* Chat messages */}
        {!bubblesHidden && messages.length > 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {/* Ask a physiotherapy question below to get started. */}
              {messages.map((msg, i) => (
                <ChatBubble key={i} message={msg} />
              ))}
            </Text>
          </View>
        )}
      </ScrollView>

      {messages.length > 0 && (
        <TouchableOpacity
          style={styles.scrollToTopButton}
          onPress={() => setBubblesHidden((v) => !v)}
        >
          <Text style={styles.scrollToTopText}>
            {bubblesHidden ? "Show Chat" : "Hide Chat / Show Topic Dropdown"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Input area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputArea}
      >
        <StreamingProgressBar
          status={streamStatus}
          error={error}
          onCancel={cancel}
          isLoading={loading}
        />

        <PhysioAdviceCategory
          adviceType={adviceType}
          onAdviceTypeChange={setAdviceType}
        />

        <View style={styles.ragToggleRow}>
          <Switch value={useRag} onValueChange={setUseRag} />
          <Text style={styles.ragToggleLabel}>
            Use research articles to support answers
          </Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask a physio question..."
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
            onFocus={() => setBubblesHidden(true)}
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
      </KeyboardAvoidingView>
    </View>
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
    maxHeight: 100,
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
  scrollToTopButton: {
    alignSelf: "center",
    marginVertical: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  scrollToTopText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  scrollToBottomButton: {
    alignSelf: "center",
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  scrollToBottomText: {
    color: "#007AFF",
    fontSize: 13,
    fontWeight: "600",
  },
});

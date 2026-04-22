import storage from "./storage";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  extra_data?: string;
}

export interface AdviceSession {
  title: string;
  messages: ChatMessage[];
}

// Legacy type kept for backward-compat migration only
export interface AdviceItem {
  message: string;
  extra_data: string;
}

const ADVICE_KEY = "adviceSessions";

function migrateSession(raw: any): AdviceSession {
  if (raw.messages) return raw as AdviceSession;
  // Old format had advice: AdviceItem[] — promote each to an assistant message
  return {
    title: raw.title ?? "Untitled",
    messages: (raw.advice ?? []).map((item: AdviceItem) => ({
      role: "assistant" as const,
      content: item.message,
      extra_data: item.extra_data,
    })),
  };
}

export async function loadAdviceSessions(): Promise<AdviceSession[]> {
  try {
    const ret = await storage.load({
      key: ADVICE_KEY,
      autoSync: true,
      syncInBackground: true,
    });
    return (ret.sessions as any[]).map(migrateSession);
  } catch {
    return [];
  }
}

async function persistSessions(sessions: AdviceSession[]): Promise<void> {
  await storage.save({ key: ADVICE_KEY, data: { sessions } });
}

export async function saveAdviceSession(session: AdviceSession): Promise<void> {
  try {
    const existing = await loadAdviceSessions();
    existing.push(session);
    await persistSessions(existing);
  } catch (error) {
    console.error("Failed to save advice session:", error);
  }
}

export async function updateAdviceSession(
  index: number,
  session: AdviceSession
): Promise<void> {
  try {
    const existing = await loadAdviceSessions();
    existing[index] = session;
    await persistSessions(existing);
  } catch (error) {
    console.error("Failed to update advice session:", error);
  }
}

export async function deleteAdviceSession(index: number): Promise<void> {
  try {
    const existing = await loadAdviceSessions();
    existing.splice(index, 1);
    await persistSessions(existing);
  } catch (error) {
    console.error("Failed to delete advice session:", error);
  }
}

export function generateTitleFromPrompt(prompt: string): string {
  const trimmed = prompt.trim();
  if (trimmed.length <= 50) return trimmed;
  return trimmed.slice(0, 47) + "...";
}

import storage from "./storage";

export interface AdviceItem {
  message: string;
  extra_data: string;
}

export interface AdviceSession {
  title: string;
  advice: AdviceItem[];
}

const ADVICE_KEY = "adviceSessions";

export async function loadAdviceSessions(): Promise<AdviceSession[]> {
  try {
    const ret = await storage.load({
      key: ADVICE_KEY,
      autoSync: true,
      syncInBackground: true,
    });
    return ret.sessions as AdviceSession[];
  } catch (error) {
    console.warn("No advice sessions found, returning empty list.", error);
    return [];
  }
}

export async function saveAdviceSession(session: AdviceSession): Promise<void> {
  try {
    const existing = await loadAdviceSessions();
    existing.push(session);
    await storage.save({
      key: ADVICE_KEY,
      data: {
        sessions: existing,
      },
    });
    console.log("Advice session saved:", session.title);
  } catch (error) {
    console.error("Failed to save advice session:", error);
  }
}

export async function deleteAdviceSession(index: number): Promise<void> {
  try {
    const existing = await loadAdviceSessions();
    existing.splice(index, 1);
    await storage.save({
      key: ADVICE_KEY,
      data: {
        sessions: existing,
      },
    });
    console.log("Advice session deleted at index:", index);
  } catch (error) {
    console.error("Failed to delete advice session:", error);
  }
}

/** Derives a short title from the user's first prompt message. */
export function generateTitleFromPrompt(prompt: string): string {
  const trimmed = prompt.trim();
  if (trimmed.length <= 50) return trimmed;
  return trimmed.slice(0, 47) + "...";
}

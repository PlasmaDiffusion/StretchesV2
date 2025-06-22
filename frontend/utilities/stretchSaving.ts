import storage from "./storage";
import { Stretch } from "../interfaces/stretchList";

/**
 * Save stretches and saveName to a given key.
 */
export async function saveStretchesToSlot(
  key: string,
  stretches: Stretch[],
  saveName: string
): Promise<void> {
  await storage.save({
    key,
    data: {
      stretches: [...stretches],
      saveName,
    },
  });
}

/**
 * Load stretches and saveName from a given key.
 */
export async function loadStretchesFromSlot(
  key: string
): Promise<{ stretches: Stretch[]; saveName?: string }> {
  const ret = await storage.load({
    key,
    autoSync: true,
    syncInBackground: true,
  });
  return { stretches: ret.stretches, saveName: ret.saveName };
}

/**
 * Load all save names for the given slots.
 */
export async function loadAllSaveNames(slots: number[]): Promise<string[]> {
  const names: string[] = [];
  for (let i = 0; i < slots.length; i++) {
    try {
      const ret = await storage.load({
        key: `save${slots[i]}`,
        autoSync: false,
        syncInBackground: false,
      });
      names.push(ret.saveName || "");
    } catch {
      names.push("");
    }
  }
  return names;
}

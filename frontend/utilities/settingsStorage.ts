import storage from "./storage";

export interface AppSettings {
  showMassagePrompt: boolean;
}

const SETTINGS_KEY = "appSettings";

export async function loadSettings(): Promise<AppSettings> {
  try {
    const ret = await storage.load({
      key: SETTINGS_KEY,
      autoSync: true,
      syncInBackground: true,
    });
    console.log("Settings loaded within loadSettings():", ret.settings);
    return ret.settings as AppSettings;
  } catch (error) {
    console.warn("No settings found, using defaults.", error);
    // Default settings
    return {
      showMassagePrompt: false,
    };
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await storage.save({
      key: SETTINGS_KEY,
      data: {
        settings,
      },
    });
    console.log("Settings saved:", settings);
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}

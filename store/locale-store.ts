import { getLanguageByCode } from "@/constants/languages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const LOCALE_KEY = "appLocale";
const AUTO_TRANSLATE_KEY = "appAutoTranslate";

type LocaleState = {
  languageCode: string;
  autoTranslate: boolean;
  isLoaded: boolean;
  hydrate: () => Promise<void>;
  setLanguage: (code: string) => Promise<void>;
  setAutoTranslate: (enabled: boolean) => Promise<void>;
};

export const useLocaleStore = create<LocaleState>((set) => ({
  languageCode: "en",
  autoTranslate: true,
  isLoaded: false,

  hydrate: async () => {
    try {
      const [storedLanguage, storedAutoTranslate] = await Promise.all([
        AsyncStorage.getItem(LOCALE_KEY),
        AsyncStorage.getItem(AUTO_TRANSLATE_KEY),
      ]);

      const languageCode =
        storedLanguage && getLanguageByCode(storedLanguage)
          ? storedLanguage
          : "en";

      set({
        languageCode,
        autoTranslate: storedAutoTranslate !== "false",
        isLoaded: true,
      });
    } catch (error) {
      console.error("Error loading locale:", error);
      set({ isLoaded: true });
    }
  },

  setLanguage: async (code) => {
    set({ languageCode: code });
    try {
      await AsyncStorage.setItem(LOCALE_KEY, code);
    } catch (error) {
      console.error("Error saving locale:", error);
    }
  },

  setAutoTranslate: async (enabled) => {
    set({ autoTranslate: enabled });
    try {
      await AsyncStorage.setItem(AUTO_TRANSLATE_KEY, enabled ? "true" : "false");
    } catch (error) {
      console.error("Error saving auto-translate:", error);
    }
  },
}));

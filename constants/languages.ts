export type Language = {
  code: string;
  name: string;
  nativeName: string;
  /** Whether the app UI is fully translated for this language */
  supported: boolean;
};

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", supported: true },
  { code: "fr", name: "French", nativeName: "Français", supported: true },
  { code: "es", name: "Spanish", nativeName: "Español", supported: false },
  { code: "de", name: "German", nativeName: "Deutsch", supported: false },
  { code: "pt", name: "Portuguese", nativeName: "Português", supported: false },
  { code: "it", name: "Italian", nativeName: "Italiano", supported: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", supported: false },
  {
    code: "zh",
    name: "Chinese (Simplified)",
    nativeName: "中文(简体)",
    supported: false,
  },
  { code: "ja", name: "Japanese", nativeName: "日本語", supported: false },
  { code: "ko", name: "Korean", nativeName: "한국어", supported: false },
  { code: "ru", name: "Russian", nativeName: "Русский", supported: false },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", supported: false },
  { code: "yo", name: "Yoruba", nativeName: "Èdè Yorùbá", supported: false },
  { code: "ig", name: "Igbo", nativeName: "Igbo", supported: false },
  { code: "ha", name: "Hausa", nativeName: "Hausa", supported: false },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", supported: false },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", supported: false },
  { code: "pl", name: "Polish", nativeName: "Polski", supported: false },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", supported: false },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    supported: false,
  },
];

export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((language) => language.code === code);
}

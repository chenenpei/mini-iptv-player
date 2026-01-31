import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { useSettingsStore } from "@/stores/useSettingsStore";

import en from "./locales/en.json";
import zh from "./locales/zh.json";

const resources = {
  zh: { translation: zh },
  en: { translation: en },
};

const languageDetector = {
  type: "languageDetector" as const,
  async: false,
  detect: () => {
    // First check store for saved language preference
    const storedLanguage = useSettingsStore.getState().language;
    if (storedLanguage) {
      return storedLanguage;
    }
    // Fall back to system locale
    const locale = Localization.getLocales()[0]?.languageCode;
    return locale === "zh" ? "zh" : "en";
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

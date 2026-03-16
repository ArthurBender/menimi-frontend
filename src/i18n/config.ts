import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import ptBR from "./pt-BR.json";

const LANGUAGE_KEY = "menimi.language";
const FALLBACK_LANGUAGE = "en";
const initialLanguage =
  typeof window !== "undefined" && window.localStorage.getItem(LANGUAGE_KEY) === "pt-BR"
    ? "pt-BR"
    : FALLBACK_LANGUAGE;

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    "pt-BR": {
      translation: ptBR,
    },
  },
  lng: initialLanguage,
  supportedLngs: ["en", "pt-BR"],
  fallbackLng: FALLBACK_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export function localeFromLanguage(language?: string) {
  return language === "pt-BR" ? "pt-BR" : "en-US";
}

export default i18n;

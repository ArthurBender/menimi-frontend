import { createContext } from "react";

export type ThemePreference = "light" | "dark";
export type LanguagePreference = "en" | "pt-BR";

export interface PreferencesContextValue {
  theme: ThemePreference;
  language: LanguagePreference;
  isSidebarOpen: boolean;
  setTheme: (theme: ThemePreference) => void;
  setLanguage: (language: LanguagePreference) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);

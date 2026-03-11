import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

import type { LanguagePreference, ThemePreference } from "./preferences-context";
import { PreferencesContext } from "./preferences-context";

const THEME_KEY = "menimi.theme";
const LANGUAGE_KEY = "menimi.language";
const SIDEBAR_KEY = "menimi.sidebar_open";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getStoredTheme(): ThemePreference {
  if (!canUseStorage()) return "light";

  const value = window.localStorage.getItem(THEME_KEY);
  return value === "dark" ? "dark" : "light";
}

function getStoredLanguage(): LanguagePreference {
  if (!canUseStorage()) return "en";

  const value = window.localStorage.getItem(LANGUAGE_KEY);
  return value === "pt-BR" ? "pt-BR" : "en";
}

function getStoredSidebarState() {
  if (!canUseStorage()) return true;

  const value = window.localStorage.getItem(SIDEBAR_KEY);
  return value === null ? true : value === "true";
}

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<ThemePreference>(() => getStoredTheme());
  const [language, setLanguage] = useState<LanguagePreference>(() => getStoredLanguage());
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => getStoredSidebarState());

  useEffect(() => {
    if (!canUseStorage()) return;
    window.localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!canUseStorage()) return;
    window.localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    if (!canUseStorage()) return;
    window.localStorage.setItem(SIDEBAR_KEY, String(isSidebarOpen));
  }, [isSidebarOpen]);

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        language,
        isSidebarOpen,
        setTheme,
        setLanguage,
        setIsSidebarOpen,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

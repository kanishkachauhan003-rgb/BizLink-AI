"use client";

import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import type { Language } from "@/types";
import { translations } from "@/lib/i18n";

type ThemeMode = "light" | "dark";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  t: (key: keyof typeof translations[Language]) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem("bizlink-language");
  return stored === "hi" || stored === "pa" ? stored : "en";
}

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("bizlink-theme");
  return stored === "dark" ? "dark" : "light";
}

export function Providers({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<Language>(readStoredLanguage);
  const [theme, setTheme] = useState<ThemeMode>(readStoredTheme);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("bizlink-language", language);
  }, [language]);

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("bizlink-theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      theme,
      setTheme,
      t: (key: keyof typeof translations[Language]) => translations[language][key],
    }),
    [language, theme]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within Providers");
  }
  return context;
}

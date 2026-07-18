"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type ChromeTheme = "dark" | "light";

type HeaderThemeContextValue = {
  theme: ChromeTheme;
  setTheme: (theme: ChromeTheme) => void;
};

const HeaderThemeContext = createContext<HeaderThemeContextValue | null>(null);

export function HeaderThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ChromeTheme>("dark");
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <HeaderThemeContext.Provider value={value}>{children}</HeaderThemeContext.Provider>;
}

export function useHeaderTheme() {
  const ctx = useContext(HeaderThemeContext);
  if (!ctx) {
    throw new Error("useHeaderTheme must be used inside HeaderThemeProvider");
  }
  return ctx;
}

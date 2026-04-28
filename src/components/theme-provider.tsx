import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "neon" | "ocean" | "sunset" | "forest" | "midnight" | "light";

export const THEMES: { id: Theme; name: string; swatch: string }[] = [
  { id: "neon", name: "Neon Cyber", swatch: "linear-gradient(135deg,#ff2bd6,#22e6ff)" },
  { id: "ocean", name: "Ocean Blue", swatch: "linear-gradient(135deg,#0066ff,#00e5d1)" },
  { id: "sunset", name: "Sunset", swatch: "linear-gradient(135deg,#ff5e3a,#ffb02e)" },
  { id: "forest", name: "Forest", swatch: "linear-gradient(135deg,#16a34a,#84cc16)" },
  { id: "midnight", name: "Midnight", swatch: "linear-gradient(135deg,#6366f1,#a855f7)" },
  { id: "light", name: "Light", swatch: "linear-gradient(135deg,#f1f5f9,#cbd5e1)" },
];

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: "neon",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("neon");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("popkid-theme")) as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme !== "light");
    localStorage.setItem("popkid-theme", theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

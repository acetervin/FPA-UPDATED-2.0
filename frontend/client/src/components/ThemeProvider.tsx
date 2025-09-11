import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "golden" | "blue";

interface ThemeProviderContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeProviderContext = createContext<ThemeProviderContext | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "golden";
    }
    return "golden";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.removeAttribute("data-theme");
    
    // Apply the selected theme
    if (theme === "blue") {
      root.setAttribute("data-theme", "blue");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "golden" ? "blue" : "golden");
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
const ThemeContext = createContext({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("nha-theme");
      } catch {}
      const next = saved === "dark" || (saved !== "light" && media.matches);
      document.documentElement.dataset.theme = next ? "dark" : "light";
      setDark(next);
    };
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = () => {
    const next: Theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setDark(next === "dark");
    try {
      localStorage.setItem("nha-theme", next);
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
      <div className="theme-corner">
        <ThemeToggle />
      </div>
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { dark, toggle } = useContext(ThemeContext);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <button
      className="theme-toggle"
      type="button"
      disabled={!ready}
      role="switch"
      aria-checked={dark}
      aria-label="Giao diện tối"
      title={dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      onClick={toggle}
    >
      <span className="theme-toggle-orb" />
      <Sun className="theme-sun" size={18} aria-hidden="true" />
      <Moon className="theme-moon" size={17} aria-hidden="true" />
    </button>
  );
}

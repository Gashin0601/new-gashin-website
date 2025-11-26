"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

export type ThemeMode = "light" | "dark" | "normal";

interface ThemeContextType {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>("normal");
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    // Initialize theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        // Handle migration from old "system" value to "normal"
        if (savedTheme === "system") {
            localStorage.setItem("theme", "normal");
            setThemeState("normal");
        } else if (savedTheme && ["light", "dark", "normal"].includes(savedTheme)) {
            setThemeState(savedTheme as ThemeMode);
        }
        setMounted(true);
    }, []);

    // Apply theme to document - re-run when theme or pathname changes
    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const isStoryPage = pathname === "/story";

        let effectiveTheme: "light" | "dark";

        if (theme === "normal") {
            // Normal mode: Story page is dark, everything else is light
            effectiveTheme = isStoryPage ? "dark" : "light";
        } else {
            // Light or dark mode: apply the selected theme to all pages
            effectiveTheme = theme;
        }

        root.setAttribute("data-theme", effectiveTheme);
        setResolvedTheme(effectiveTheme);
    }, [theme, mounted, pathname]);

    const setTheme = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    // Prevent flash by not rendering until mounted
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

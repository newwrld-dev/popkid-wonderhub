import { Palette } from "lucide-react";
import { useState } from "react";
import { THEMES, useTheme } from "./theme-provider";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        className="flex h-10 w-10 items-center justify-center rounded-lg glass hover:border-primary transition"
      >
        <Palette className="h-5 w-5 text-accent" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 rounded-xl glass p-2 shadow-glow z-50">
            <p className="px-2 pb-2 pt-1 text-xs uppercase tracking-widest text-muted-foreground">Themes</p>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-secondary transition ${
                  theme === t.id ? "bg-secondary" : ""
                }`}
              >
                <span className="h-6 w-6 rounded-md border border-border" style={{ background: t.swatch }} />
                <span className="font-medium">{t.name}</span>
                {theme === t.id && <span className="ml-auto text-xs text-primary">●</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

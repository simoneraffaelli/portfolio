"use client"

import { User, FolderKanban, Mail, Sun, Moon, Palette } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import type { Section, Theme } from "@/lib/types"

interface TitleBarProps {
  activeSection: Section
  onNavigate: (section: Section) => void
  theme: Theme
  onThemeChange: (theme: Theme) => void
  isDark: boolean
  onModeToggle: () => void
}

const sections: { id: Section; icon: typeof User; label: string }[] = [
  { id: "whoami", icon: User, label: "whoami" },
  { id: "projects", icon: FolderKanban, label: "projects" },
  { id: "contact", icon: Mail, label: "contact" },
]

const themes: { id: Theme; color: string; label: string }[] = [
  { id: "green", color: "#4ade80", label: "Matrix" },
  { id: "amber", color: "#fbbf24", label: "Amber" },
  { id: "rose", color: "#f472b6", label: "Rose" },
  { id: "cyan", color: "#22d3ee", label: "Cyan" },
  { id: "violet", color: "#a78bfa", label: "Violet" },
]

export function TitleBar({ 
  activeSection, 
  onNavigate, 
  theme, 
  onThemeChange,
  isDark,
  onModeToggle 
}: TitleBarProps) {
  const [showPalette, setShowPalette] = useState(false)
  const paletteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setShowPalette(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5 border-b border-border bg-card/50">
      {/* Title - start aligned */}
      <div className="flex items-center gap-2 font-mono text-sm">
        <span className="text-primary">~</span>
        <span className="hidden sm:inline text-muted-foreground">/dev/</span>
        <span className="hidden sm:inline text-foreground font-medium">portfolio</span>
      </div>

      {/* Controls - end aligned */}
      <div className="flex items-center gap-1">
        {/* Theme color picker */}
        <div className="relative" ref={paletteRef}>
          <button
            onClick={() => setShowPalette(!showPalette)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
            aria-label="Change theme color"
          >
            <Palette className="w-4 h-4" />
          </button>
          
          {showPalette && (
            <div className="absolute right-0 top-full mt-2 p-3 bg-card border border-border rounded-lg shadow-xl animate-scale-in z-50">
              <p className="text-xs text-muted-foreground font-mono mb-2">theme</p>
              <div className="flex items-center gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onThemeChange(t.id)
                      setShowPalette(false)
                    }}
                    className="group relative"
                    aria-label={`${t.label} theme`}
                  >
                    <div 
                      className={`
                        w-6 h-6 rounded-full transition-all border-2
                        ${theme === t.id 
                          ? "border-foreground scale-110" 
                          : "border-transparent hover:scale-110 hover:border-muted-foreground/50"
                        }
                      `}
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Light/dark mode toggle */}
        <button
          onClick={onModeToggle}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
          aria-label="Toggle light/dark mode"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-border mx-1" />

        {/* Section icons */}
        {sections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id
          return (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className={`
                relative p-2 rounded-md transition-all group
                ${isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }
              `}
              aria-label={section.label}
            >
              <Icon className="w-4 h-4" />
              {isActive && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-mono bg-popover border border-border rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {section.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

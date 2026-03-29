"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { TerminalInput } from "./terminal-input"
import { TitleBar } from "./title-bar"
import { WhoAmISection } from "./sections/whoami"
import { ProjectsSection } from "./sections/projects"
import { ContactSection } from "./sections/contact"
import { PlaygroundSection } from "./sections/playground"
import { MatrixRain } from "./matrix-rain"
import type { Section, Theme } from "@/lib/types"
import { sectionAliases, getStaticResponse } from "@/lib/commands"
import { playgroundRegistry } from "@/lib/playgrounds"
import { useSimoneExplosion } from "@/hooks/use-simone-explosion"
import { useEasterEggs } from "@/hooks/use-easter-eggs"

export function Portfolio() {
  const [activeSection, setActiveSection] = useState<Section>("whoami")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [theme, setTheme] = useState<Theme>("green")
  const [isDark, setIsDark] = useState(true)
  const [key, setKey] = useState(0)
  const [playgroundId, setPlaygroundId] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { isLocked: isSimoneLocked, trigger: triggerSimoneExplosion } = useSimoneExplosion(contentRef)
  const {
    showMatrix,
    showGlitch,
    easterEggMessage,
    meowMode,
    triggerMatrix,
    triggerGlitch,
    triggerParty,
    triggerMeow,
    showMessage,
    triggerFlip,
    triggerSpin,
  } = useEasterEggs(contentRef, setTheme)

  // Apply theme to HTML element
  useEffect(() => {
    const html = document.documentElement
    
    html.classList.remove(
      "theme-green", "theme-amber", "theme-rose", "theme-cyan", "theme-violet",
      "dark", "light"
    )
    
    html.classList.add(`theme-${theme}`)
    html.classList.add(isDark ? "dark" : "light")
  }, [theme, isDark])

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    }
  }, [])

  const navigateTo = useCallback((section: Section) => {
    if (section === activeSection || isTransitioning) return
    setIsTransitioning(true)
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    transitionTimeoutRef.current = setTimeout(() => {
      setActiveSection(section)
      setKey(k => k + 1)
      transitionTimeoutRef.current = setTimeout(() => setIsTransitioning(false), 50)
    }, 150)
  }, [activeSection, isTransitioning])

  const handleCommand = useCallback((command: string): { success: boolean; message?: string } => {
    if (isSimoneLocked && command !== "simone") {
      return { success: false, message: "simone protocol running..." }
    }

    // Playground commands
    if (command === "playground" || command === "playgrounds") {
      const ids = Object.keys(playgroundRegistry)
      return { success: true, message: `available: ${ids.map(id => `playground ${id}`).join(", ")}` }
    }
    if (command.startsWith("playground ")) {
      const arg = command.slice("playground ".length).trim()
      if (arg in playgroundRegistry) {
        setPlaygroundId(arg)
        if (activeSection === "playground") {
          setKey(k => k + 1)
        } else {
          navigateTo("playground")
        }
        return { success: true, message: `entering playground/${arg}...` }
      }
      return { success: false, message: `unknown playground: ${arg}. try: playgrounds to see available pgs` }
    }

    // Navigation commands
    if (sectionAliases[command]) {
      navigateTo(sectionAliases[command])
      return { success: true, message: `cd ${sectionAliases[command]}` }
    }

    // Theme commands
    if (command === "light" || command === "day") {
      setIsDark(false)
      return { success: true, message: "let there be light" }
    }
    if (command === "dark" || command === "night") {
      setIsDark(true)
      return { success: true, message: "darkness falls" }
    }
    if (command.startsWith("theme ")) {
      const themeName = command.split(" ")[1] as Theme
      if (["green", "amber", "rose", "cyan", "violet"].includes(themeName)) {
        setTheme(themeName)
        return { success: true, message: `theme set to ${themeName}` }
      }
      return { success: false, message: "themes: green, amber, rose, cyan, violet" }
    }

    // Pure-response commands (no side effects)
    const staticResult = getStaticResponse(command)
    if (staticResult) return staticResult

    // Stateful commands (need React state or DOM effects)
    switch (command) {
      case "clear":
      case "cls":
      case "reset":
        setKey(k => k + 1)
        return { success: true, message: "cleared" }

      case "meow":
      case "cat language":
      case "nyan":
        triggerMeow()
        return { success: true, message: "meow meow mrrp!" }

      case "simone":
        if (triggerSimoneExplosion()) {
          return { success: true, message: "simone protocol activated..." }
        }
        return { success: true, message: "simone protocol already running" }

      case "sudo":
      case "sudo rm -rf":
      case "sudo rm -rf /":
      case "rm -rf /":
        triggerGlitch()
        return { success: true, message: "permission denied... just kidding, nice try" }

      case "matrix":
      case "neo":
      case "redpill":
        triggerMatrix()
        return { success: true, message: "wake up, neo..." }

      case "party":
      case "disco":
      case "rave":
        triggerParty()
        return { success: true, message: "party mode activated!" }

      case "glitch":
      case "hack":
      case "crash":
        triggerGlitch()
        return { success: true, message: "system malfunction..." }

      case "flip":
      case "rotate":
      case "australia":
        triggerFlip()
        return { success: true, message: "g'day mate" }

      case "spin":
      case "barrel roll":
      case "do a barrel roll":
        triggerSpin()
        return { success: true, message: "wheeeee!" }

      case "all-cmds":
      case "all-commands":
        window.open(
          "https://github.com/simoneraffaelli/portfolio?tab=readme-ov-file#command-reference",
          "_blank",
          "noopener,noreferrer"
        )
        return { success: true, message: "opening command reference..." }

      case "old":
        window.open("https://old.simone.ooo/", "_blank", "noopener,noreferrer")
        return { success: true, message: "opening old portfolio..." }

      case "secret":
      case "secrets":
      case "easter":
        showMessage("you found a secret! there are 30+ hidden commands...")
        return { success: true, message: "shhh..." }

      case "konami":
        showMessage("up up down down left right left right B A")
        return { success: true, message: "classic" }

      case "reboot":
      case "restart":
        window.location.reload()
        return { success: true, message: "rebooting..." }

      case "hire me":
        navigateTo("contact")
        return { success: true, message: "great choice! let's talk" }

      default:
        return { success: false, message: `zsh: command not found: ${command}` }
    }
  }, [isSimoneLocked, activeSection, navigateTo, triggerGlitch, triggerMatrix, triggerParty, triggerMeow, triggerFlip, triggerSpin, showMessage, triggerSimoneExplosion])

  return (
    <div 
      className={`
        h-screen w-screen flex flex-col bg-background overflow-hidden 
        transition-colors duration-300
        ${showGlitch ? "animate-glitch" : ""}
        ${meowMode ? "meow-mode" : ""}
      `}
    >
      {/* Matrix rain overlay */}
      {showMatrix && <MatrixRain />}

      {/* Easter egg message popup */}
      {easterEggMessage && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-4 bg-card border border-primary rounded-lg shadow-2xl animate-scale-in">
          <p className="font-mono text-primary text-center">{easterEggMessage}</p>
        </div>
      )}

      {/* Title Bar */}
      <TitleBar
        activeSection={activeSection}
        onNavigate={navigateTo}
        theme={theme}
        onThemeChange={setTheme}
        isDark={isDark}
        onModeToggle={() => setIsDark(!isDark)}
      />

      {/* Terminal Input */}
      <TerminalInput onCommand={handleCommand} disabled={isSimoneLocked} />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full min-h-0 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div 
            ref={contentRef}
            key={key}
            className={`h-full min-h-0 transition-opacity duration-150 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {activeSection === "whoami" && <WhoAmISection />}
            {activeSection === "projects" && <ProjectsSection />}
            {activeSection === "contact" && <ContactSection />}
            {activeSection === "playground" && playgroundId && <PlaygroundSection playgroundId={playgroundId} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 border-t border-border bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="text-xs text-muted-foreground font-mono">
            <span className="text-primary">$</span> built with next.js
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
            <span className="hidden sm:inline opacity-60">type &quot;help&quot; for commands</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-subtle-pulse" />
              <span>online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

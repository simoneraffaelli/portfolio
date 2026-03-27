"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { TerminalInput } from "./terminal-input"
import { TitleBar } from "./title-bar"
import { WhoAmISection } from "./sections/whoami"
import { ProjectsSection } from "./sections/projects"
import { ContactSection } from "./sections/contact"
import { MatrixRain } from "./matrix-rain"

type Section = "whoami" | "projects" | "contact"
type Theme = "green" | "amber" | "rose" | "cyan" | "violet"

const sectionAliases: Record<string, Section> = {
  about: "whoami",
  me: "whoami",
  who: "whoami",
  bio: "whoami",
  whoami: "whoami",
  projects: "projects",
  work: "projects",
  portfolio: "projects",
  builds: "projects",
  ls: "projects",
  contact: "contact",
  email: "contact",
  hire: "contact",
  reach: "contact",
  mail: "contact",
}

const easterEggCommands = [
  "matrix",
  "party",
  "glitch",
  "meow",
  "flip",
  "barrel roll",
  "bluepill",
  "konami",
  "iddqd",
  "rickroll",
  "sudo make me a sandwich",
  "fortune",
  "spin",
  "xyzzy",
]

// Keep in sync with the corresponding CSS animation durations.
const SIMONE_BLAST_DURATION_MS = 260
const SIMONE_MUTATION_START_DELAY_MS = 80
const SIMONE_EXPLOSION_DURATION_MS = 2600

function pickRandomEasterEggCommands(count: number) {
  const pool = [...easterEggCommands]

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, Math.min(count, pool.length))
}

export function Portfolio() {
  const [activeSection, setActiveSection] = useState<Section>("whoami")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [theme, setTheme] = useState<Theme>("green")
  const [isDark, setIsDark] = useState(true)
  const [showMatrix, setShowMatrix] = useState(false)
  const [showGlitch, setShowGlitch] = useState(false)
  const [easterEggMessage, setEasterEggMessage] = useState<string | null>(null)
  const [key, setKey] = useState(0)
  const [partyMode, setPartyMode] = useState(false)
  const [meowMode, setMeowMode] = useState(false)
  const [isSimoneLocked, setIsSimoneLocked] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const originalContent = useRef<Map<Node, string>>(new Map())
  const simoneAnimationRunning = useRef(false)

  // Apply theme to HTML element
  useEffect(() => {
    const html = document.documentElement
    
    // Remove all theme classes
    html.classList.remove(
      "theme-green", "theme-amber", "theme-rose", "theme-cyan", "theme-violet",
      "dark", "light"
    )
    
    // Add current theme
    html.classList.add(`theme-${theme}`)
    html.classList.add(isDark ? "dark" : "light")
  }, [theme, isDark])

  // Party mode - cycle through themes
  useEffect(() => {
    if (!partyMode) return
    const themes: Theme[] = ["green", "amber", "rose", "cyan", "violet"]
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % themes.length
      setTheme(themes[i])
    }, 500)
    return () => clearInterval(interval)
  }, [partyMode])

  // Meow mode - transform text
  useEffect(() => {
    if (!meowMode || !contentRef.current) return

    const walker = document.createTreeWalker(
      contentRef.current,
      NodeFilter.SHOW_TEXT,
      null
    )

    const textNodes: Text[] = []
    let node: Node | null
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.trim()) {
        textNodes.push(node as Text)
      }
    }

    // Store original and transform
    textNodes.forEach((textNode) => {
      if (!originalContent.current.has(textNode)) {
        originalContent.current.set(textNode, textNode.nodeValue || "")
      }
      const original = textNode.nodeValue || ""
      const meowed = original.replace(/\b\w+\b/g, (word) => {
        const meows = ["meow", "mew", "mrrp", "prr", "nya"]
        const m = meows[Math.floor(Math.random() * meows.length)]
        // Preserve capitalization
        if (word[0] === word[0].toUpperCase()) {
          return m.charAt(0).toUpperCase() + m.slice(1)
        }
        return m
      })
      textNode.nodeValue = meowed
    })

    // Revert after 4 seconds
    const timeout = setTimeout(() => {
      originalContent.current.forEach((original, node) => {
        if (node.nodeValue !== undefined) {
          node.nodeValue = original
        }
      })
      originalContent.current.clear()
      setMeowMode(false)
    }, 4000)

    return () => clearTimeout(timeout)
  }, [meowMode, activeSection])

  const navigateTo = useCallback((section: Section) => {
    if (section === activeSection || isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveSection(section)
      setKey(k => k + 1)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 150)
  }, [activeSection, isTransitioning])

  const showMessage = (msg: string, duration = 3000) => {
    setEasterEggMessage(msg)
    setTimeout(() => setEasterEggMessage(null), duration)
  }

  const triggerGlitch = () => {
    setShowGlitch(true)
    setTimeout(() => setShowGlitch(false), 300)
  }

  const triggerSimoneExplosion = () => {
    if (simoneAnimationRunning.current) {
      return false
    }

    const contentRoot = contentRef.current
    if (!contentRoot) {
      return false
    }

    simoneAnimationRunning.current = true
    setIsSimoneLocked(true)
    window.__SIMONE_DOM_MODE__ = true
    document.body.classList.add("simone-blast-start")

    const blastOverlay = document.createElement("div")
    blastOverlay.className = "simone-blast-overlay"
    document.body.appendChild(blastOverlay)

    const startFxTimeout = setTimeout(() => {
      document.body.classList.remove("simone-blast-start")
      blastOverlay.remove()
    }, SIMONE_BLAST_DURATION_MS)

    const resetSimoneMode = () => {
      clearTimeout(startFxTimeout)
      document.body.classList.remove("simone-blast-start")
      document.body.classList.remove("simone-explosion-active")
      document.body.classList.remove("simone-freeze-ui")
      blastOverlay.remove()
      window.__SIMONE_DOM_MODE__ = false
      setIsSimoneLocked(false)
      simoneAnimationRunning.current = false
    }

    setTimeout(() => {
      if (!contentRoot.isConnected) {
        resetSimoneMode()
        return
      }

      document.body.classList.add("simone-explosion-active")
      document.body.classList.add("simone-freeze-ui")

      const hideTargets = Array.from(contentRoot.querySelectorAll<HTMLElement>("[data-simone-hide='true']"))
      const hiddenTargetState = hideTargets.map((el) => ({
        el,
        opacity: el.style.opacity,
        visibility: el.style.visibility,
      }))
      hiddenTargetState.forEach(({ el }) => {
        el.style.opacity = "0"
        el.style.visibility = "hidden"
      })

      const scrollTargets = Array.from(contentRoot.querySelectorAll<HTMLElement>(".terminal-scrollbar"))
      const scrollState = scrollTargets.map((el) => ({
        el,
        overflow: el.style.overflow,
        overflowX: el.style.overflowX,
        overflowY: el.style.overflowY,
      }))
      scrollState.forEach(({ el }) => {
        el.classList.add("simone-scrollbar-hidden")
        el.style.overflow = "hidden"
        el.style.overflowX = "hidden"
        el.style.overflowY = "hidden"
      })

      const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT"])
      const walker = document.createTreeWalker(contentRoot, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement
          if (!parent) return NodeFilter.FILTER_REJECT
          if (skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT
          if (parent.closest("[data-simone-ignore='true']")) return NodeFilter.FILTER_REJECT
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT
          return NodeFilter.FILTER_ACCEPT
        }
      })

      const textNodes: Text[] = []
      let currentNode: Node | null
      while ((currentNode = walker.nextNode())) {
        textNodes.push(currentNode as Text)
      }

      const chunks: Array<{ chunk: HTMLSpanElement; originalTextNode: Text }> = []

      textNodes.forEach((textNode) => {
        const originalText = textNode.nodeValue ?? ""
        const parent = textNode.parentNode
        if (!parent || !parent.contains(textNode)) {
          return
        }

        const chunk = document.createElement("span")
        chunk.className = "simone-chunk"
        chunk.dataset.originalText = originalText

        for (const char of originalText) {
          if (char.trim() === "") {
            chunk.appendChild(document.createTextNode(char))
            continue
          }

          const letter = document.createElement("span")
          letter.className = "simone-letter"
          letter.textContent = char
          letter.style.setProperty("--sx", `${Math.round((Math.random() * 2 - 1) * 220)}px`)
          letter.style.setProperty("--sy", `${Math.round(-80 - Math.random() * 200)}px`)
          letter.style.setProperty("--rot", `${Math.round((Math.random() * 2 - 1) * 900)}deg`)
          letter.style.setProperty("--delay", `${Math.round(Math.random() * 180)}ms`)
          letter.style.setProperty("--duration", `${1200 + Math.round(Math.random() * 900)}ms`)
          chunk.appendChild(letter)
        }

        parent.replaceChild(chunk, textNode)
        chunks.push({ chunk, originalTextNode: textNode })
      })

      const cleanup = () => {
        chunks.forEach(({ chunk, originalTextNode }) => {
          if (!chunk.isConnected) return
          chunk.replaceWith(originalTextNode)
        })

        hiddenTargetState.forEach(({ el, opacity, visibility }) => {
          if (!el.isConnected) return
          el.style.opacity = opacity
          el.style.visibility = visibility
        })

        scrollState.forEach(({ el, overflow, overflowX, overflowY }) => {
          if (!el.isConnected) return
          el.classList.remove("simone-scrollbar-hidden")
          el.style.overflow = overflow
          el.style.overflowX = overflowX
          el.style.overflowY = overflowY
        })

        resetSimoneMode()
      }

      setTimeout(cleanup, SIMONE_EXPLOSION_DURATION_MS)
    }, SIMONE_MUTATION_START_DELAY_MS)

    return true
  }

  const handleCommand = useCallback((command: string): { success: boolean; message?: string } => {
    if (isSimoneLocked && command !== "simone") {
      return { success: false, message: "simone protocol running..." }
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

    // Easter eggs
    switch (command) {
      case "help":
      case "?":
      case "commands":
        const suggestions = pickRandomEasterEggCommands(3)
        return { 
          success: true, 
          message: `whoami, projects, contact | all-commands | and also: ${suggestions.join(", ")}` 
        }
      
      case "clear":
      case "cls":
      case "reset":
        setKey(k => k + 1)
        return { success: true, message: "cleared" }
      
      case "hello":
      case "hi":
      case "hey":
      case "yo":
        const greetings = ["hey there!", "hello friend", "greetings, human", "sup!"]
        return { success: true, message: greetings[Math.floor(Math.random() * greetings.length)] }
      
      case "meow":
      case "cat language":
      case "nyan":
        setMeowMode(true)
        return { success: true, message: "meow meow mrrp!" }

      case "simone":
        if (triggerSimoneExplosion()) {
          return { success: true, message: "simone protocol activated..." }
        }
        return { success: true, message: "simone protocol already running" }

      case "woof":
      case "bark":
        return { success: true, message: "wrong species, try 'meow'" }

      case "sudo":
      case "sudo rm -rf":
      case "sudo rm -rf /":
      case "rm -rf /":
        triggerGlitch()
        return { success: true, message: "permission denied... just kidding, nice try" }
      
      case "matrix":
      case "neo":
      case "redpill":
        setShowMatrix(true)
        setTimeout(() => setShowMatrix(false), 6000)
        return { success: true, message: "wake up, neo..." }

      case "bluepill":
        return { success: true, message: "ignorance is bliss" }
      
      case "party":
      case "disco":
      case "rave":
        setPartyMode(true)
        setTimeout(() => setPartyMode(false), 5000)
        return { success: true, message: "party mode activated!" }

      case "glitch":
      case "hack":
      case "crash":
        triggerGlitch()
        return { success: true, message: "system malfunction..." }
      
      case "flip":
      case "rotate":
      case "australia":
        document.body.style.transform = "rotate(180deg)"
        document.body.style.transition = "transform 0.5s"
        setTimeout(() => {
          document.body.style.transform = ""
        }, 3000)
        return { success: true, message: "g'day mate" }

      case "spin":
      case "barrel roll":
      case "do a barrel roll":
        document.body.style.transition = "transform 1s"
        document.body.style.transform = "rotate(360deg)"
        setTimeout(() => {
          document.body.style.transform = ""
        }, 1000)
        return { success: true, message: "wheeeee!" }

      case "coffee":
      case "brew":
        return { success: true, message: "brewing... error 418: i'm a teapot" }

      case "java":
        return { success: true, message: "NullPointerException" }

      case "javascript":
      case "js":
        return { success: true, message: "[] + [] = '' ... trust me" }

      case "rust":
        return { success: true, message: "memory safety guaranteed (compiler screaming)" }

      case "python":
        return { success: true, message: "import antigravity" }
      
      case "pwd":
        return { success: true, message: "~/dev/portfolio" }
      
      case "cd ..":
      case "cd":
      case "cd ~":
        return { success: true, message: "you're already home" }
      
      case "cat":
        return { success: true, message: "meow? try the 'meow' command" }

      case "dog":
        return { success: true, message: "woof woof" }

      case "cow":
      case "cowsay":
        return { success: true, message: " ____\n< moo >\n ----\n   ^__^\n   (oo)\\_______\n   (__)\\       )" }
      
      case "date":
      case "now":
        return { success: true, message: new Date().toLocaleDateString("en-US", { 
          weekday: "long", year: "numeric", month: "long", day: "numeric" 
        })}
      
      case "time":
        return { success: true, message: new Date().toLocaleTimeString() }
      
      case "theme":
      case "themes":
      case "colors":
        return { success: true, message: "try: theme green | amber | rose | cyan | violet" }

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

      case "vim":
        return { success: true, message: "good luck exiting! (hint: :q!)" }

      case "nvim":
      case "neovim":
        return { success: true, message: "i see you're a person of culture" }
      
      case "emacs":
        return { success: true, message: "M-x butterfly" }

      case "nano":
        return { success: true, message: "a sensible choice" }

      case "code":
      case "vscode":
        return { success: true, message: "you're already looking at code" }

      case "cursor":
        return { success: true, message: "ai-powered fingers go brrrr" }

      case "git":
      case "git status":
        return { success: true, message: "on branch main, portfolio looking fresh" }

      case "git push":
        return { success: true, message: "everything up-to-date" }

      case "git pull":
        return { success: true, message: "already up to date" }

      case "git commit":
        return { success: true, message: "nothing to commit, working tree clean" }

      case "npm":
      case "npm install":
      case "pnpm":
      case "yarn":
      case "bun":
        return { success: true, message: "added 847 packages in 0.3s" }

      case "deno":
        return { success: true, message: "permission denied. grant with --allow-dinosaur" }
      
      case "ping":
        return { success: true, message: "pong! 64 bytes, time=0.042ms" }

      case "pong":
        return { success: true, message: "ping! ...wait" }

      case "42":
      case "answer":
        return { success: true, message: "the answer to life, the universe, and everything" }

      case "69":
        return { success: true, message: "nice" }

      case "420":
        return { success: true, message: "blaze it" }

      case "konami":
        showMessage("up up down down left right left right B A")
        return { success: true, message: "classic" }

      case "xyzzy":
        return { success: true, message: "a hollow voice says 'fool'" }

      case "iddqd":
        return { success: true, message: "god mode activated (not really)" }
      
      case "exit":
      case "quit":
      case "q":
      case ":q":
      case ":q!":
      case ":wq":
        return { success: true, message: "there is no escape... refresh to restart" }

      case "reboot":
      case "restart":
        window.location.reload()
        return { success: true, message: "rebooting..." }

      case "fortune":
      case "quote":
        const fortunes = [
          "the best code is no code at all",
          "it works on my machine",
          "undefined is not a function",
          "have you tried turning it off and on again?",
          "there are only 2 hard problems: cache invalidation, naming things, and off-by-one errors",
          "99 bugs in the code, take one down, patch it around, 127 bugs in the code",
          "works on my machine - ship it!",
          "git push --force (and pray)"
        ]
        return { success: true, message: fortunes[Math.floor(Math.random() * fortunes.length)] }

      case "weather":
        return { success: true, message: "partly cloudy with a chance of commits" }

      case "uptime":
        return { success: true, message: `up ${Math.floor(Math.random() * 365)} days, still coding` }

      case "version":
      case "-v":
      case "--version":
        return { success: true, message: "portfolio v2.0.0 (built with next.js)" }

      case "man":
        return { success: true, message: "RTFM: type 'help' for available commands" }

      case "make":
      case "make install":
        return { success: true, message: "no makefile found, this is 2026" }

      case "love":
      case "heart":
      case "<3":
        return { success: true, message: "<3" }

      case "thanks":
      case "thank you":
      case "thx":
        return { success: true, message: "you're welcome! enjoy exploring" }

      case "sorry":
        return { success: true, message: "no worries!" }

      case "please":
        return { success: true, message: "since you asked nicely... type 'help'" }

      case "hire me":
        navigateTo("contact")
        return { success: true, message: "great choice! let's talk" }

      case "money":
      case "salary":
      case "pay":
        return { success: true, message: "let's discuss that over coffee" }

      case "music":
      case "play":
        return { success: true, message: "lo-fi beats to code to..." }

      case "sleep":
      case "zzz":
        return { success: true, message: "developers don't sleep, they await" }

      case "sudo make me a sandwich":
        return { success: true, message: "ok." }

      case "make me a sandwich":
        return { success: true, message: "what? make it yourself" }

      case "hello world":
        return { success: true, message: "console.log('hello world')" }

      case "rickroll":
      case "rick":
        return { success: true, message: "never gonna give you up, never gonna let you down..." }

      case "sus":
      case "amogus":
      case "among us":
        return { success: true, message: "that's kinda sus" }

      case "bruh":
        return { success: true, message: "bruh moment" }

      case "lol":
      case "lmao":
      case "haha":
        return { success: true, message: "glad you're having fun!" }

      case ":(":
      case "sad":
        return { success: true, message: "turn that frown upside down :)" }

      case ":)":
      case "happy":
      case "smile":
        return { success: true, message: ":D" }

      case "ai":
      case "chatgpt":
      case "gpt":
      case "claude":
        return { success: true, message: "i'm something of an ai myself" }

      case "blockchain":
      case "crypto":
      case "web3":
        return { success: true, message: "it's just a linked list with extra steps" }

      case "serverless":
        return { success: true, message: "there's still a server, it's just not your problem" }

      case "cloud":
        return { success: true, message: "it's just someone else's computer" }

      default:
        return { success: false, message: `zsh: command not found: ${command}` }
    }
  }, [isSimoneLocked, navigateTo])

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

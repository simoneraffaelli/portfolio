"use client"

import { useEffect, useState, useRef } from "react"

declare global {
  interface Window {
    __SIMONE_DOM_MODE__?: boolean
  }
}

const skills = [
  { category: "Languages", items: ["TypeScript", "C#", "Kotlin", "JavaScript"] },
  { category: "Frontend", items: ["React", "Next.js", "Compose", "Tailwind"] },
  { category: "Backend", items: ["Node.js", "PostgreSQL", ".NET Core", "Rust"] },
  { category: "Tools", items: ["Git", "Docker", "Claude Code", "Copilot"] },
]

const phrases = [
  "I build things for the web.",
  "I build things for mobile.",
  "I build APIs that scale.",
  "I build beautiful UIs.",
  "I build developer tools.",
  "I turn coffee into code.",
  "I fix bugs at 3am.",
  "I google stuff professionally.",
]

export function WhoAmISection() {
  const [showContent, setShowContent] = useState(false)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  
  // Typing animation state
  const [displayText, setDisplayText] = useState("")
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fade in content
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Typing/deleting effect
  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]
    const isSimoneDomMode = () => typeof window !== "undefined" && window.__SIMONE_DOM_MODE__
    
    const type = () => {
      if (isSimoneDomMode()) {
        typingTimeoutRef.current = setTimeout(type, 120)
        return
      }

      if (isDeleting) {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(prev => prev.slice(0, -1))
          typingTimeoutRef.current = setTimeout(type, 30) // faster delete
        } else {
          setIsDeleting(false)
          setPhraseIndex(prev => (prev + 1) % phrases.length)
        }
      } else {
        // Typing
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1))
          typingTimeoutRef.current = setTimeout(type, 60) // typing speed
        } else {
          // Pause at end before deleting
          typingTimeoutRef.current = setTimeout(() => {
            if (isSimoneDomMode()) {
              type()
              return
            }
            setIsDeleting(true)
            type()
          }, 2500)
        }
      }
    }

    typingTimeoutRef.current = setTimeout(type, isDeleting ? 30 : 60)

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [displayText, isDeleting, phraseIndex])

  return (
    <div className={`
      h-full min-h-0 flex flex-col gap-6 sm:gap-8 overflow-y-auto overflow-x-hidden pr-2 pb-4 terminal-scrollbar
      transition-opacity duration-300 ease-out
      ${showContent ? "opacity-100" : "opacity-0"}
    `}>
      {/* Hero */}
      <div>
        <p className="text-muted-foreground text-sm font-mono mb-2">
          <span className="text-primary">//</span> hello, I&apos;m
        </p>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-4">
          simone
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl min-h-[2rem]">
          {displayText}
          {showCursor && (
            <span data-simone-hide="true" className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-cursor" />
          )}
        </p>
      </div>

      {/* Bio */}
      <div className="text-muted-foreground leading-relaxed max-w-2xl">
        <p>
          A developer passionate about crafting clean, performant, and accessible 
          digital experiences. Currently focused on travelling and building useless gimmicks.
        </p>
      </div>

      {/* Skills Grid */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 content-start">
        {skills.map((skillGroup, groupIndex) => (
          <div 
            key={skillGroup.category}
            className="transition-opacity duration-300"
            style={{ 
              transitionDelay: `${groupIndex * 50}ms`,
              opacity: showContent ? 1 : 0
            }}
          >
            <h3 className="text-xs font-mono text-primary mb-3 uppercase tracking-wider flex items-center gap-2">
              <span data-simone-hide="true" className="w-2 h-px bg-primary" />
              {skillGroup.category}
            </h3>
            <ul className="space-y-1.5">
              {skillGroup.items.map((skill) => (
                <li 
                  key={skill}
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className={`
                    text-sm transition-all duration-200 cursor-default relative pl-3
                    ${hoveredSkill === skill 
                      ? "text-foreground" 
                      : "text-muted-foreground"
                    }
                  `}
                >
                  <span data-simone-hide="true" className={`
                    absolute left-0 text-primary transition-all duration-200
                    ${hoveredSkill === skill ? "opacity-100" : "opacity-0"}
                  `}>
                    &gt;
                  </span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div data-simone-hide="true" className="relative">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping opacity-75" />
          </div>
          <span className="text-muted-foreground">Available for work</span>
        </div>
        <span className="text-border hidden sm:inline">|</span>
        <span className="text-muted-foreground">Currently based in Italy </span>
      </div>
    </div>
  )
}

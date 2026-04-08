"use client"

import { useState, useEffect, type ComponentType } from "react"
import { ArrowUpRight } from "lucide-react"
import { PretextPlayground } from "@/components/playgrounds/pretext"
import { ParticleTextPlayground } from "@/components/playgrounds/particle-text"

const playgroundComponents: Record<string, ComponentType> = {
  pretext: PretextPlayground,
  particletext: ParticleTextPlayground,
}

const playgroundMeta: Record<string, { label: string; description: string }> = {
  pretext: { label: "Pretext", description: "physics-based canvas text playground" },
  particletext: { label: "Particle Text", description: "ASCII art particle dissolve effect" },
}

export function getRenderablePlaygroundIds(): string[] {
  return Object.keys(playgroundComponents)
}

export function isRenderablePlaygroundId(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(playgroundComponents, id)
}

interface PlaygroundSectionProps {
  playgroundId: string
}

export function PlaygroundSection({ playgroundId }: PlaygroundSectionProps) {
  const Component = playgroundComponents[playgroundId]

  if (!Component) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm font-mono text-destructive">
          playground not found: {playgroundId}
        </p>
      </div>
    )
  }

  return <Component />
}

interface PlaygroundListSectionProps {
  onOpen: (id: string) => void
}

export function PlaygroundListSection({ onOpen }: PlaygroundListSectionProps) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const ids = getRenderablePlaygroundIds()
  const totalLines = 3 + ids.length

  useEffect(() => {
    setVisibleLines(0)
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= totalLines) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 80)
    return () => clearInterval(interval)
  }, [totalLines])

  return (
    <div className="h-full min-h-0 flex flex-col overflow-y-auto overflow-x-hidden pr-2 pb-4 terminal-scrollbar">
      <div className="mb-6 sm:mb-8">
        <p
          className="text-muted-foreground text-sm font-mono mb-2 terminal-line"
          style={{ animationDelay: "0ms", opacity: visibleLines >= 1 ? 1 : 0 }}
        >
          <span className="text-primary">//</span> interactive experiments
        </p>
        <h2
          className="text-2xl font-medium tracking-tight text-foreground mb-4 terminal-line"
          style={{ animationDelay: "80ms", opacity: visibleLines >= 1 ? 1 : 0 }}
        >
          Playgrounds
        </h2>
        <p
          className="text-muted-foreground leading-relaxed max-w-lg terminal-line"
          style={{ animationDelay: "160ms", opacity: visibleLines >= 2 ? 1 : 0 }}
        >
          A collection of interactive canvas experiments. Click one to open it, or type{" "}
          <span className="text-primary font-mono">playground &lt;id&gt;</span> in the terminal.
        </p>
      </div>

      <div
        className="terminal-line"
        style={{ animationDelay: "240ms", opacity: visibleLines >= 3 ? 1 : 0 }}
      >
        <p className="text-xs font-mono text-primary mb-3 uppercase tracking-wider flex items-center gap-2">
          <span data-simone-hide="true" className="w-2 h-px bg-primary" />
          Available
        </p>
        <div className="space-y-2">
          {ids.map((id, i) => {
            const meta = playgroundMeta[id]
            return (
              <button
                key={id}
                onClick={() => onOpen(id)}
                className="group w-full flex items-center justify-between py-3 px-3 -mx-3 rounded-lg transition-all duration-200 hover:bg-card text-left"
                style={{ opacity: visibleLines >= 3 + i ? 1 : 0, transition: "opacity 150ms, background-color 200ms" }}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span className={`font-mono transition-colors duration-200 ${hoveredId === id ? "text-primary" : "text-foreground"}`}>
                    {meta?.label ?? id}
                  </span>
                  {meta?.description && (
                    <span className="text-sm text-muted-foreground">{meta.description}</span>
                  )}
                </div>
                <ArrowUpRight className={`
                  w-4 h-4 transition-all duration-200
                  ${hoveredId === id
                    ? "text-primary translate-x-0.5 -translate-y-0.5 opacity-100"
                    : "text-muted-foreground opacity-0"
                  }
                `} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

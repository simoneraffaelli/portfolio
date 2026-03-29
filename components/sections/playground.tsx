"use client"

import type { ComponentType } from "react"
import { PretextPlayground } from "@/components/playgrounds/pretext"
import { ParticleTextPlayground } from "@/components/playgrounds/particle-text"

const playgroundComponents: Record<string, ComponentType> = {
  pretext: PretextPlayground,
  particletext: ParticleTextPlayground,
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

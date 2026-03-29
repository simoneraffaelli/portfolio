export const playgroundRegistry: Record<string, { title: string; description: string }> = {
  pretext: {
    title: "Text Chaos",
    description: "bouncing orbs with real-time text reflow",
  },
  particletext: {
    title: "Particle Text",
    description: "text made of particles that scatter & reform",
  },
}

export function getPlaygroundIds(): string[] {
  return Object.keys(playgroundRegistry)
}

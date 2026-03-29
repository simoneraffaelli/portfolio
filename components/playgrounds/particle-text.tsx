"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { resolveCssVar } from "@/lib/canvas-utils"

// Character pool for particles
const CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?+=~<>{}[]"

// ASCII art rendered as multiline text on the offscreen canvas
const PEPE = [
  "⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⣠⡶⠛⠉⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⢦⡀⠀⢀⣴⠞⠋⠉⠉⠉⠉⠙⠛⠶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⢀⡾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣶⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⢠⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⠀⠸⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠘⠀⠀⠀⠀⠀⠀⢀⣴⠖⠛⠋⠉⠉⠉⠉⠉⠉⠙⠛⠻⢦⣄⠀⠀⣀⣠⣤⣤⣤⣤⣤⣄⣀⠈⢷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⢠⡾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢻⣏⠉⠀⠀⠀⠀⠀⠀⠈⠉⠙⠲⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠻⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣀⣀⣀⣀⣤⣄⣤⣤⣄⣀⣀⣤⣀⡈⢷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⡈⢻⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⢀⡴⠟⠉⣉⣉⣩⣭⣽⠥⠦⣤⣌⣉⠛⠿⢦⣄⠈⠛⢶⣗⠀⠀⠀⠀⠀⢰⣞⣻⣽⣽⣭⣭⣭⣽⣷⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⢀⡴⢋⣠⠾⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⢦⣄⡙⢷⣄⠀⠹⣧⡀⠀⢀⡶⠟⣫⣭⢿⡿⠿⠿⠷⣦⡉⢻⣿⡄⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⢻⣧⣾⣁⣤⡤⠴⠶⠖⣶⣶⣶⣶⣶⣶⣶⣶⠒⠛⠛⠳⣿⢷⣤⢺⣇⠀⠉⣢⣿⣿⣿⣾⣶⣶⣦⣄⡀⠹⣾⡏⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠉⠙⡳⠶⣄⣼⣿⣷⢾⣿⡟⠋⠛⣿⡇⠀⠀⠀⠈⣷⠘⢷⡟⢀⡾⣿⣿⣩⣿⣿⠿⢿⣧⠈⠙⠳⢾⣇⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣦⡈⠻⢿⣿⣼⣿⣷⣦⣾⣿⠇⠀⠀⠀⠀⠘⣧⢸⢣⡟⠀⣿⣿⣟⣿⣿⣤⣾⡿⠀⢀⣴⢿⡟⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣦⣀⠀⠉⠉⠛⠿⠿⠿⢤⣤⣤⡴⠖⠛⢉⣿⠈⢹⡓⢿⠿⠿⠿⠿⠿⠿⠷⠞⠋⣡⡾⠁⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠛⠛⠛⠛⠳⠶⠤⠴⠶⢤⣴⠾⠋⠁⠀⠈⠛⠶⣤⡤⠤⠴⠆⢀⡾⢷⣾⢯⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⣴⡶⠶⠖⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠈⢳⣄⠀⠀⠛⠛⠛⠁⠀⢻⣆⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⣀⣠⣴⡶⠾⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⠶⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢧⠀⠀⠀⠀⠀⠀⠀⣿⣦⠀⠀⠀⠀⠀⠀⠀",
  "⠀⣼⢏⣿⠛⠿⠶⢤⣄⣀⡀⠀⠀⠀⠀⠐⠻⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠇⢸⡇⠀⠀⠀⠀⠀⠀",
  "⠀⠈⠘⣿⣄⠘⢷⣄⣀⠉⠙⠛⠒⠲⠶⣤⣤⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⠃⣠⡟⠁⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠈⠙⠷⣄⣈⠉⠙⠳⠶⢤⣄⣀⡀⠀⠀⠉⠉⠉⠛⠛⠳⠶⠶⠶⠶⠶⠶⠤⢤⣤⣤⣤⣤⣤⣤⡤⠶⠾⠋⣠⣾⡋⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠙⠛⢦⣄⡀⠀⠈⠉⠙⠛⠛⠛⠛⠛⠛⠶⢦⣤⣤⣤⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣤⠾⠋⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠳⢶⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⣰⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠶⠦⠤⠤⢤⣄⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣠⣤⣄⣀⣀⣠⡤⠞⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⣉⣭⣉⠁⠀⣠⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⡶⠛⠉⠉⠙⢷⣴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡴⠛⠁⠀⠀⠀⠀⠀⠀⠹⠦⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡶⠒⠳⣦⠾⠛⢷⡄⠀⠀⣠⡴⢶⣤⣄⠀⣠⡌⠙⠷⣄⡀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣄⠀⠀⠹⣦⣠⣾⣃⡴⠟⢁⡼⢋⣴⣯⠞⠋⠀⠀⠀⠈⠻⣆⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣦⡀⠀⠈⠉⢿⠁⢠⡼⣋⡴⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠙⢷⡄⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⡄⠀⠀⢸⣶⢋⣼⠋⠀⠀⠀⠀⣀⡴⠟⠀⠀⠀⠀⠀⠀⢻⣄⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠙⠿⣧⡀⠀⠀⠀⣴⠏⠀⠀⠀⢀⣴⠆⠀⢀⠀⠻⣆⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣇⠀⠀⠀⠀⠀⠈⠻⣦⣤⣼⠃⠀⠀⢀⣠⠞⠁⠀⣠⡾⠀⠀⠻⡆",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠟⠃⠹⠗⠀⠀⠀⠀⠀⠀⠀⠀⠙⠓⠀⠀⠾⠃⠀⠀⠸⠋⠀⠀⠀⠀⠿",
].join("\n")

interface PhraseEntry {
  label: string
  // text: single line rendered as big text. art: multiline rendered line-by-line
  mode: "text" | "art"
  content: string
}

const PHRASES: PhraseEntry[] = [
  { label: "particles", mode: "text", content: "particles" },
  { label: "simone", mode: "text", content: "simone" },
  { label: "🚀🚀🚀", mode: "text", content: "🚀🚀🚀" },
  { label: "NOICE", mode: "text", content: "NOICE" },
  { label: "pepe", mode: "art", content: PEPE },
]

const FONT_SIZE = 120
const MOUSE_RADIUS = 80
const RETURN_SPEED = 0.08
const SCATTER_FORCE = 8
const FRICTION = 0.88
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"

interface Particle {
  hx: number
  hy: number
  x: number
  y: number
  vx: number
  vy: number
  hueShift: number
  brightness: number
  char: string
}

function sampleToParticles(
  entry: PhraseEntry,
  canvasW: number,
  canvasH: number,
  gap: number,
): Particle[] {
  const off = document.createElement("canvas")
  off.width = canvasW
  off.height = canvasH
  const ctx = off.getContext("2d")!
  ctx.clearRect(0, 0, canvasW, canvasH)
  ctx.fillStyle = "#fff"

  if (entry.mode === "text") {
    const maxCharW = canvasW / (entry.content.length * 0.7)
    const fontSize = Math.min(FONT_SIZE, maxCharW, canvasH * 0.4)
    ctx.font = `900 ${fontSize}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(entry.content, canvasW / 2, canvasH / 2)
  } else {
    // Multiline ASCII art — fit to canvas
    const lines = entry.content.split("\n")
    const maxLineLen = Math.max(...lines.map(l => l.length))
    // Size font so art fits in ~80% of canvas
    const fontW = (canvasW * 0.85) / (maxLineLen * 0.6)
    const fontH = (canvasH * 0.85) / lines.length
    const fontSize = Math.min(fontW, fontH, 22)
    ctx.font = `${fontSize}px monospace`
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    const totalH = lines.length * fontSize * 1.1
    const startY = (canvasH - totalH) / 2
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], canvasW / 2, startY + i * fontSize * 1.1)
    }
  }

  const data = ctx.getImageData(0, 0, canvasW, canvasH).data
  const particles: Particle[] = []

  for (let y = 0; y < canvasH; y += gap) {
    for (let x = 0; x < canvasW; x += gap) {
      const i = (y * canvasW + x) * 4
      const a = data[i + 3]
      if (a > 128) {
        const bright = data[i] / 255
        particles.push({
          hx: x,
          hy: y,
          x: canvasW / 2 + (Math.random() - 0.5) * canvasW * 0.8,
          y: canvasH / 2 + (Math.random() - 0.5) * canvasH * 0.8,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          hueShift: Math.random() * 0.3,
          brightness: bright,
          char: CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)],
        })
      }
    }
  }
  return particles
}

export function ParticleTextPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const colorsRef = useRef({ primary: [0, 0, 0] as [number, number, number], bg: [0, 0, 0] as [number, number, number] })
  const stateRef = useRef<{
    particles: Particle[]
    mouse: { x: number; y: number; active: boolean }
    raf: number
    running: boolean
    phraseIndex: number
    scrambleTimer: ReturnType<typeof setTimeout> | null
    isTransitioning: boolean
    gap: number
  }>({
    particles: [],
    mouse: { x: -9999, y: -9999, active: false },
    raf: 0,
    running: false,
    phraseIndex: 0,
    scrambleTimer: null,
    isTransitioning: false,
    gap: 5,
  })

  const refreshColors = useCallback(() => {
    colorsRef.current.primary = resolveCssVar("--primary")
    colorsRef.current.bg = resolveCssVar("--background")
  }, [])

  const [ready, setReady] = useState(false)
  const [currentLabel, setCurrentLabel] = useState(PHRASES[0].label)

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const dpr = window.devicePixelRatio || 1
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    return { w: rect.width, h: rect.height, dpr }
  }, [])

  const buildParticles = useCallback((entry: PhraseEntry) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = stateRef.current
    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr

    const area = w * h
    s.gap = area > 400000 ? 6 : area > 200000 ? 5 : 4

    const newParticles = sampleToParticles(entry, w, h, s.gap)

    // Reuse existing particle positions for smooth morph
    const oldParticles = s.particles
    for (let i = 0; i < newParticles.length; i++) {
      if (i < oldParticles.length) {
        newParticles[i].x = oldParticles[i].x
        newParticles[i].y = oldParticles[i].y
        newParticles[i].vx = oldParticles[i].vx
        newParticles[i].vy = oldParticles[i].vy
      } else {
        // New particles spawn from random positions
        newParticles[i].x = w / 2 + (Math.random() - 0.5) * w
        newParticles[i].y = h / 2 + (Math.random() - 0.5) * h
      }
    }

    s.particles = newParticles
  }, [])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = stateRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr

    const { primary, bg } = colorsRef.current

    ctx.save()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Clear with theme background
    ctx.fillStyle = `rgb(${bg[0]},${bg[1]},${bg[2]})`
    ctx.fillRect(0, 0, w, h)

    const mx = s.mouse.x
    const my = s.mouse.y
    const mouseActive = s.mouse.active

    for (const p of s.particles) {
      // Mouse repulsion
      if (mouseActive) {
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * SCATTER_FORCE
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
      }

      // Spring back to home
      const dx = p.hx - p.x
      const dy = p.hy - p.y
      p.vx += dx * RETURN_SPEED
      p.vy += dy * RETURN_SPEED

      // Friction
      p.vx *= FRICTION
      p.vy *= FRICTION

      // Move
      p.x += p.vx
      p.y += p.vy

      // Draw
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
      const alpha = Math.min(1, 0.5 + speed * 0.1 + p.brightness * 0.3)

      // Color: primary with brightness variation
      const r = Math.min(255, primary[0] + p.hueShift * 60)
      const g = Math.min(255, primary[1] + p.hueShift * 30)
      const b = Math.min(255, primary[2] + p.hueShift * 40)

      ctx.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${alpha})`

      // Draw as character
      const charSize = Math.max(6, s.gap * 1.2 + Math.min(speed * 0.5, 4))
      ctx.font = `${charSize}px monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(p.char, p.x, p.y)
    }

    ctx.restore()
  }, [])

  const loop = useCallback(() => {
    const s = stateRef.current
    if (!s.running) return
    render()
    s.raf = requestAnimationFrame(loop)
  }, [render])

  // Scramble transition to next phrase
  const transitionToNext = useCallback(() => {
    const s = stateRef.current
    if (s.isTransitioning) return
    s.isTransitioning = true

    // Explode: give all particles a big random velocity
    for (const p of s.particles) {
      const angle = Math.random() * Math.PI * 2
      const force = 8 + Math.random() * 12
      p.vx += Math.cos(angle) * force
      p.vy += Math.sin(angle) * force
    }

    const nextIndex = (s.phraseIndex + 1) % PHRASES.length
    const nextEntry = PHRASES[nextIndex]

    // Scramble through random text before landing on next phrase
    let scrambleCount = 0
    const maxScrambles = 6
    const scrambleStep = () => {
      if (scrambleCount < maxScrambles) {
        // Show random scramble text
        const len = nextEntry.label.length + 2
        let scrambled = ""
        for (let i = 0; i < len; i++) {
          scrambled += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        }
        buildParticles({ label: scrambled, mode: "text", content: scrambled })
        scrambleCount++
        s.scrambleTimer = setTimeout(scrambleStep, 60)
      } else {
        // Land on real next phrase
        s.phraseIndex = nextIndex
        buildParticles(nextEntry)
        setCurrentLabel(nextEntry.label)
        s.isTransitioning = false
      }
    }

     s.scrambleTimer = setTimeout(scrambleStep, 150)
  }, [buildParticles])

  // Init
  useEffect(() => {
    refreshColors()
    const dims = resizeCanvas()
    if (!dims) return

    buildParticles(PHRASES[0])
    const s = stateRef.current
    s.running = true
    s.raf = requestAnimationFrame(loop)

    setReady(true)

    // Watch for theme changes (class attribute on <html>)
    const observer = new MutationObserver(() => refreshColors())
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] })

    const handleResize = () => {
      resizeCanvas()
      buildParticles(PHRASES[s.phraseIndex])
    }
    window.addEventListener("resize", handleResize)

    return () => {
      s.running = false
      if (s.raf) cancelAnimationFrame(s.raf)
      if (s.scrambleTimer) clearTimeout(s.scrambleTimer)
      observer.disconnect()
      window.removeEventListener("resize", handleResize)
    }
  }, [resizeCanvas, buildParticles, loop, refreshColors])

  // Pointer tracking
  const getCoords = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX
    const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }, [])

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoords(e.nativeEvent)
    stateRef.current.mouse = { ...coords, active: true }
  }, [getCoords])

  const handleLeave = useCallback(() => {
    stateRef.current.mouse.active = false
  }, [])

  const handleClick = useCallback(() => {
    transitionToNext()
  }, [transitionToNext])

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden">
      <div className="mb-3 flex-shrink-0">
        <p className="text-muted-foreground text-sm font-mono mb-1">
          <span className="text-primary">//</span> playground/particletext
        </p>
        <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
          Particle Text
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Text rendered as particles — hover to scatter, click to cycle.
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex-1 min-h-0 relative rounded-lg border border-border overflow-hidden bg-background"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            touchAction: "none",
            cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Ccircle cx='6' cy='6' r='5' fill='white' stroke='black' stroke-width='1'/%3E%3C/svg%3E") 6 6, crosshair`,
          }}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          onTouchMove={handleMove}
          onTouchEnd={handleLeave}
          onClick={handleClick}
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm font-mono text-muted-foreground animate-pulse">
              loading...
            </p>
          </div>
        )}
      </div>

      {ready && (
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs font-mono text-muted-foreground flex-shrink-0">
          <span>
            &quot;<span className="text-primary">{currentLabel}</span>&quot;
          </span>
          <span className="hidden sm:inline opacity-60">
            hover to scatter · click to cycle
          </span>
        </div>
      )}
    </div>
  )
}

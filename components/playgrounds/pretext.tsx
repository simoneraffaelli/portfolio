"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { resolveCssVar } from "@/lib/canvas-utils"

// Shower thoughts / meme text — makes people actually read and stay
const DEMO_TEXT =
  "Men's public restrooms are laid out all wrong. It should be urinal, stall, " +
  "urinal, stall, urinal instead of urinal, urinal, urinal, stall, stall. " +
  "The 'richest people' list in actuality is the 'legally richest people', " +
  "which is only close to the actual richest people list. There are tons of " +
  "illegal super rich people. When you eat at home with your partner, it's " +
  "weird to eat different entrees, but when you eat at a restaurant, it's " +
  "weird to eat the same entree. If you sleep 5 hours per night and die at " +
  "age 75, you'll still have spent just as many years awake as a person who " +
  "sleeps 8 hours per night and dies at age 89. Temperature can reach " +
  "trillions of degrees, meaning we actually live extremely close to absolute " +
  "zero. The universe is 13.8 billion years old, but heat death is around " +
  "10¹⁰⁰ years away, so it has effectively used 0% of its lifetime meaning " +
  "the universe is still basically a baby 👶 and we're living in its " +
  "earliest, most active era. If radio was invented today it would be " +
  "controlled by four companies and locked behind a paywall. If you are an " +
  "identical twin, there is a non-zero chance your parents got you confused " +
  "for your sibling as an infant, so you aren't who you think you are. I bet " +
  "the person whose Social Security number is 420-69-8008 wishes they could " +
  "tell everyone what it is 🤣 Aliens wouldn't invade earth to enslave " +
  "humanity or for Earth's resources. Aliens can travel across the galaxy. " +
  "They will have all the technological advancements 🚀 and the entirety of " +
  "the infinite vastness of space and all of its resources. The first 2 or 3 " +
  "years of the Truman Show must've been really boring to watch. The " +
  "invention of clothes likely helped boost human birthrates, by inadvertently " +
  "increasing arousal when someone occasionally sees nudity. If the 'use it " +
  "or lose it' theory of neuroscience is correct, then we're going to have " +
  "an absolute explosion of AI-induced Alzheimer's in the future 🧠 " +
  "Technically, every book is either about Harry Potter or it isn't. " +
  "People who say 'money can't buy happiness' have clearly never been sad at " +
  "a jet ski dealership."

const LINE_HEIGHT = 22
const FONT_SIZE = 14
const GAP = 12
const PADDING = 16
const MIN_LINE_W = 30

const EMOJIS = ["🚀", "💀", "🔥", "✨", "🐐", "🧠", "👾", "🌀", "⚡", "🎯", "🫠", "💎"]

interface Orb {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  emoji: string
  hue: number
}

function spawnOrb(w: number, h: number, r?: number): Orb {
  const radius = r ?? 35 + Math.random() * 35
  const speed = 40 + Math.random() * 60
  const angle = Math.random() * Math.PI * 2
  return {
    x: radius + Math.random() * (w - radius * 2),
    y: radius + Math.random() * (h - radius * 2),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: radius,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    hue: Math.random() * 360,
  }
}

type LayoutNextLine = (p: unknown, c: unknown, w: number) => { text: string; width: number; end: unknown } | null

type RGB = [number, number, number]

function rgba(c: RGB, a: number): string {
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`
}

function rgb(c: RGB): string {
  return `rgb(${c[0]},${c[1]},${c[2]})`
}

export function PretextPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<{
    prepared: unknown
    layoutNextLine: LayoutNextLine | null
    orbs: Orb[]
    dragIndex: number
    dragOffset: { x: number; y: number }
    raf: number
    font: string
    lastTime: number
    running: boolean
  }>({
    prepared: null,
    layoutNextLine: null,
    orbs: [],
    dragIndex: -1,
    dragOffset: { x: 0, y: 0 },
    raf: 0,
    font: "",
    lastTime: 0,
    running: false,
  })

  const colorsRef = useRef({ fg: [0, 0, 0] as RGB, primary: [0, 0, 0] as RGB, mutedFg: [0, 0, 0] as RGB })
  const [metrics, setMetrics] = useState({ lines: 0, ms: 0, orbs: 0 })
  const [ready, setReady] = useState(false)

  const refreshColors = useCallback(() => {
    colorsRef.current.fg = resolveCssVar("--foreground")
    colorsRef.current.primary = resolveCssVar("--primary")
    colorsRef.current.mutedFg = resolveCssVar("--muted-foreground")
  }, [])

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
  }, [])

  // Physics — move orbs, bounce off walls & each other
  const step = useCallback((dt: number) => {
    const s = stateRef.current
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr

    for (let i = 0; i < s.orbs.length; i++) {
      const o = s.orbs[i]
      if (i === s.dragIndex) continue // skip dragged orb

      o.x += o.vx * dt
      o.y += o.vy * dt

      // Wall bounce
      if (o.x - o.r < 0) { o.x = o.r; o.vx = Math.abs(o.vx) }
      if (o.x + o.r > w) { o.x = w - o.r; o.vx = -Math.abs(o.vx) }
      if (o.y - o.r < 0) { o.y = o.r; o.vy = Math.abs(o.vy) }
      if (o.y + o.r > h) { o.y = h - o.r; o.vy = -Math.abs(o.vy) }

      // Orb-orb bounce
      for (let j = i + 1; j < s.orbs.length; j++) {
        const b = s.orbs[j]
        const dx = b.x - o.x
        const dy = b.y - o.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const minDist = o.r + b.r
        if (dist < minDist && dist > 0) {
          const nx = dx / dist
          const ny = dy / dist
          // Push apart
          const overlap = (minDist - dist) / 2
          o.x -= nx * overlap
          o.y -= ny * overlap
          b.x += nx * overlap
          b.y += ny * overlap
          // Elastic collision
          const dvx = o.vx - b.vx
          const dvy = o.vy - b.vy
          const dvn = dvx * nx + dvy * ny
          if (dvn > 0) {
            o.vx -= dvn * nx
            o.vy -= dvn * ny
            b.vx += dvn * nx
            b.vy += dvn * ny
          }
        }
      }
    }
  }, [])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = stateRef.current
    if (!s.prepared || !s.layoutNextLine) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr

    const { fg, primary, mutedFg } = colorsRef.current

    ctx.save()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    // Draw orbs
    for (const orb of s.orbs) {
      // Glow
      const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r * 1.3)
      grad.addColorStop(0, rgba(primary, 0.15))
      grad.addColorStop(1, rgba(primary, 0))
      ctx.beginPath()
      ctx.arc(orb.x, orb.y, orb.r * 1.3, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      // Circle fill
      ctx.beginPath()
      ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2)
      ctx.fillStyle = rgba(primary, 0.08)
      ctx.fill()
      ctx.strokeStyle = rgba(primary, 0.4)
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Emoji
      ctx.font = `${Math.round(orb.r * 0.7)}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(orb.emoji, orb.x, orb.y + 2)
    }

    // Layout text flowing around ALL orbs
    ctx.font = s.font
    ctx.textAlign = "start"
    ctx.textBaseline = "top"
    ctx.fillStyle = rgb(fg)

    let cursor: unknown = { segmentIndex: 0, graphemeIndex: 0 }
    let y = PADDING
    let lineCount = 0
    const t0 = performance.now()

    while (y + LINE_HEIGHT <= h - PADDING) {
      const lineTop = y
      const lineBot = y + LINE_HEIGHT
      const lineLeft = PADDING
      const lineRight = w - PADDING

      // Build exclusion zones for this line from all orbs
      const exclusions: { left: number; right: number }[] = []
      for (const orb of s.orbs) {
        const closestY = Math.max(lineTop, Math.min(lineBot, orb.y))
        const dy = closestY - orb.y
        if (Math.abs(dy) < orb.r) {
          const dx = Math.sqrt(orb.r * orb.r - dy * dy)
          exclusions.push({
            left: orb.x - dx - GAP,
            right: orb.x + dx + GAP,
          })
        }
      }

      // Find the widest clear segment for text
      // Sort exclusions by left edge
      exclusions.sort((a, b) => a.left - b.left)

      // Merge overlapping
      const merged: { left: number; right: number }[] = []
      for (const ex of exclusions) {
        if (merged.length && ex.left <= merged[merged.length - 1].right) {
          merged[merged.length - 1].right = Math.max(merged[merged.length - 1].right, ex.right)
        } else {
          merged.push({ ...ex })
        }
      }

      // Find best gap
      let bestLeft = lineLeft
      let bestWidth = 0

      // Gap before first exclusion
      if (merged.length === 0) {
        bestLeft = lineLeft
        bestWidth = lineRight - lineLeft
      } else {
        // Left edge to first exclusion
        const gapW = Math.max(0, merged[0].left - lineLeft)
        if (gapW > bestWidth) { bestLeft = lineLeft; bestWidth = gapW }

        // Between exclusions
        for (let i = 0; i < merged.length - 1; i++) {
          const gLeft = merged[i].right
          const gRight = merged[i + 1].left
          const gW = Math.max(0, gRight - gLeft)
          if (gW > bestWidth) { bestLeft = gLeft; bestWidth = gW }
        }

        // After last exclusion
        const lastGapW = Math.max(0, lineRight - merged[merged.length - 1].right)
        if (lastGapW > bestWidth) { bestLeft = merged[merged.length - 1].right; bestWidth = lastGapW }
      }

      if (bestWidth < MIN_LINE_W) {
        y += LINE_HEIGHT
        continue
      }

      const line = s.layoutNextLine(s.prepared, cursor, bestWidth)
      if (line === null) break

      const textY = y + (LINE_HEIGHT - FONT_SIZE) / 2
      ctx.fillText(line.text, bestLeft, textY)
      cursor = line.end
      y += LINE_HEIGHT
      lineCount++
    }

    const layoutMs = performance.now() - t0

    // Bottom-right hint
    ctx.font = "11px monospace"
    ctx.fillStyle = rgba(mutedFg, 0.4)
    ctx.textAlign = "right"
    ctx.textBaseline = "bottom"
    ctx.fillText("click to spawn · drag to move · right-click to pop", w - 12, h - 8)

    ctx.restore()

    // Throttle React metrics updates to avoid re-rendering at ~60fps.
    const now = performance.now()
    const lastMetricsUpdate = (s as any).metricsLastUpdate || 0
    if (now - lastMetricsUpdate >= 250) {
      ;(s as any).metricsLastUpdate = now
      const orbsCount = s.orbs.length
      setMetrics(prev => {
        if (
          prev.lines === lineCount &&
          prev.ms === layoutMs &&
          prev.orbs === orbsCount
        ) {
          return prev
        }
        return { lines: lineCount, ms: layoutMs, orbs: orbsCount }
      })
    }
  }, [])

  // Main animation loop
  const loop = useCallback((time: number) => {
    const s = stateRef.current
    if (!s.running) return
    const dt = s.lastTime ? Math.min((time - s.lastTime) / 1000, 0.05) : 0.016
    s.lastTime = time
    step(dt)
    render()
    s.raf = requestAnimationFrame(loop)
  }, [step, render])

  // Init Pretext + start loop
  useEffect(() => {
    let canceled = false

    async function init() {
      await document.fonts.ready
      const mod = await import("@chenglou/pretext")
      if (canceled) return

      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return

      const font = `${FONT_SIZE}px ${getComputedStyle(canvas).fontFamily}`
      const prepared = mod.prepareWithSegments(DEMO_TEXT, font)

      const s = stateRef.current
      s.prepared = prepared
      s.layoutNextLine = mod.layoutNextLine as LayoutNextLine
      s.font = font

      // Spawn initial orbs
      const rect = container.getBoundingClientRect()
      s.orbs = [
        spawnOrb(rect.width, rect.height, 55),
        spawnOrb(rect.width, rect.height, 42),
        spawnOrb(rect.width, rect.height, 48),
      ]

      s.running = true
      s.lastTime = 0
      setReady(true)
    }

    init()
    return () => {
      canceled = true
      stateRef.current.running = false
      if (stateRef.current.raf) cancelAnimationFrame(stateRef.current.raf)
    }
  }, [])

  // Start loop when ready + watch for theme changes
  useEffect(() => {
    if (!ready) return
    refreshColors()
    resizeCanvas()
    const s = stateRef.current
    s.running = true
    s.raf = requestAnimationFrame(loop)

    const observer = new MutationObserver(() => refreshColors())
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] })

    return () => {
      s.running = false
      if (s.raf) cancelAnimationFrame(s.raf)
      observer.disconnect()
    }
  }, [ready, resizeCanvas, loop, refreshColors])

  // Handle resize
  useEffect(() => {
    if (!ready) return
    const handleResize = () => resizeCanvas()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [ready, resizeCanvas])

  // Pointer interactions
  const getCoords = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX
    const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }, [])

  const handlePointerDown = useCallback((e: MouseEvent | React.MouseEvent) => {
    const raw = "nativeEvent" in e ? e.nativeEvent : e
    const coords = getCoords(raw)
    const s = stateRef.current

    // Check if clicking on an orb
    for (let i = s.orbs.length - 1; i >= 0; i--) {
      const orb = s.orbs[i]
      const dist = Math.sqrt((coords.x - orb.x) ** 2 + (coords.y - orb.y) ** 2)
      if (dist <= orb.r + 8) {
        s.dragIndex = i
        s.dragOffset = { x: coords.x - orb.x, y: coords.y - orb.y }
        e.preventDefault()
        return
      }
    }
  }, [getCoords])

  const handleTouchDown = useCallback((e: TouchEvent) => {
    const coords = getCoords(e)
    const s = stateRef.current

    for (let i = s.orbs.length - 1; i >= 0; i--) {
      const orb = s.orbs[i]
      const dist = Math.sqrt((coords.x - orb.x) ** 2 + (coords.y - orb.y) ** 2)
      if (dist <= orb.r + 8) {
        s.dragIndex = i
        s.dragOffset = { x: coords.x - orb.x, y: coords.y - orb.y }
        e.preventDefault()
        return
      }
    }
  }, [getCoords])

  const handlePointerMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    const s = stateRef.current
    if (s.dragIndex < 0) return
    e.preventDefault()
    const raw = "nativeEvent" in e ? e.nativeEvent : e
    const coords = getCoords(raw)
    const orb = s.orbs[s.dragIndex]
    if (orb) {
      orb.x = coords.x - s.dragOffset.x
      orb.y = coords.y - s.dragOffset.y
      orb.vx = 0
      orb.vy = 0
    }
  }, [getCoords])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const s = stateRef.current
    if (s.dragIndex < 0) return
    e.preventDefault()
    const coords = getCoords(e)
    const orb = s.orbs[s.dragIndex]
    if (orb) {
      orb.x = coords.x - s.dragOffset.x
      orb.y = coords.y - s.dragOffset.y
      orb.vx = 0
      orb.vy = 0
    }
  }, [getCoords])

  const handlePointerUp = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent) => {
    const raw = "nativeEvent" in e ? e.nativeEvent : e
    const s = stateRef.current
    if (s.dragIndex >= 0) {
      const orb = s.orbs[s.dragIndex]
      if (orb) {
        const angle = Math.random() * Math.PI * 2
        const speed = 30 + Math.random() * 50
        orb.vx = Math.cos(angle) * speed
        orb.vy = Math.sin(angle) * speed
      }
      s.dragIndex = -1
      return
    }

    // Click on empty space: spawn new orb
    const coords = getCoords(raw)
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr
    const newOrb = spawnOrb(w, h)
    newOrb.x = coords.x
    newOrb.y = coords.y
    s.orbs.push(newOrb)
  }, [getCoords])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const coords = getCoords(e.nativeEvent)
    const s = stateRef.current
    // Remove the orb closest to click if within range
    for (let i = s.orbs.length - 1; i >= 0; i--) {
      const orb = s.orbs[i]
      const dist = Math.sqrt((coords.x - orb.x) ** 2 + (coords.y - orb.y) ** 2)
      if (dist <= orb.r + 8) {
        s.orbs.splice(i, 1)
        return
      }
    }
  }, [getCoords])

  // Attach touch listeners with { passive: false } so preventDefault works
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const onTouchEnd = (e: TouchEvent) => handlePointerUp(e)
    canvas.addEventListener("touchstart", handleTouchDown, { passive: false })
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("touchend", onTouchEnd)
    return () => {
      canvas.removeEventListener("touchstart", handleTouchDown)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", onTouchEnd)
    }
  }, [handleTouchDown, handleTouchMove, handlePointerUp])

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden">
      <div className="mb-3 flex-shrink-0">
        <p className="text-muted-foreground text-sm font-mono mb-1">
          <span className="text-primary">//</span> playground/pretext
        </p>
        <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
          Text Chaos
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Bouncing orbs meet real-time text reflow via{" "}
          <a
            href="https://github.com/chenglou/pretext"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @chenglou/pretext
          </a>
          . Zero DOM reads. All JS.
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex-1 min-h-0 relative rounded-lg border border-border overflow-hidden bg-background"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair font-sans"
          style={{ fontSize: `${FONT_SIZE}px`, touchAction: "none" }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={() => { stateRef.current.dragIndex = -1 }}
          onContextMenu={handleContextMenu}
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm font-mono text-muted-foreground animate-pulse">
              loading pretext...
            </p>
          </div>
        )}
      </div>

      {ready && (
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs font-mono text-muted-foreground flex-shrink-0">
          <span>
            <span className="text-primary">{metrics.orbs}</span> orbs
          </span>
          <span>
            <span className="text-primary">{metrics.lines}</span> lines
          </span>
          <span>
            <span className="text-primary">{metrics.ms.toFixed(2)}</span>ms
          </span>
          <span className="hidden sm:inline opacity-60">
            click to spawn · drag to move · right-click to pop
          </span>
        </div>
      )}
    </div>
  )
}

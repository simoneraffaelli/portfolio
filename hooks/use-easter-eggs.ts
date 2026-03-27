import { useState, useEffect, useRef, useCallback } from "react"
import type { Theme } from "@/lib/types"

/**
 * Manages timed visual effects: matrix rain, glitch, party mode,
 * meow mode, popup messages, and body transforms.
 *
 * All timers are properly cleaned up on unmount.
 */
export function useEasterEggs(
  contentRef: React.RefObject<HTMLDivElement | null>,
  setTheme: (theme: Theme) => void,
) {
  const [showMatrix, setShowMatrix] = useState(false)
  const [showGlitch, setShowGlitch] = useState(false)
  const [easterEggMessage, setEasterEggMessage] = useState<string | null>(null)
  const [partyMode, setPartyMode] = useState(false)
  const [meowMode, setMeowMode] = useState(false)

  const originalContent = useRef<Map<Node, string>>(new Map())
  const matrixTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const glitchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bodyTransformTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const partyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (matrixTimeoutRef.current) clearTimeout(matrixTimeoutRef.current)
      if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current)
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current)
      if (bodyTransformTimeoutRef.current) clearTimeout(bodyTransformTimeoutRef.current)
      if (partyTimeoutRef.current) clearTimeout(partyTimeoutRef.current)
    }
  }, [])

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
  }, [partyMode, setTheme])

  // Meow mode - transform text
  useEffect(() => {
    if (!meowMode || !contentRef.current) return

    const walker = document.createTreeWalker(
      contentRef.current,
      NodeFilter.SHOW_TEXT,
      null,
    )

    const textNodes: Text[] = []
    let node: Node | null
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.trim()) {
        textNodes.push(node as Text)
      }
    }

    textNodes.forEach((textNode) => {
      if (!originalContent.current.has(textNode)) {
        originalContent.current.set(textNode, textNode.nodeValue || "")
      }
      const original = textNode.nodeValue || ""
      const meowed = original.replace(/\b\w+\b/g, (word) => {
        const meows = ["meow", "mew", "mrrp", "prr", "nya"]
        const m = meows[Math.floor(Math.random() * meows.length)]
        if (word[0] === word[0].toUpperCase()) {
          return m.charAt(0).toUpperCase() + m.slice(1)
        }
        return m
      })
      textNode.nodeValue = meowed
    })

    const timeout = setTimeout(() => {
      originalContent.current.forEach((original, n) => {
        if (n.nodeValue !== undefined) {
          n.nodeValue = original
        }
      })
      originalContent.current.clear()
      setMeowMode(false)
    }, 4000)

    return () => clearTimeout(timeout)
  }, [meowMode, contentRef])

  const triggerMatrix = useCallback(() => {
    setShowMatrix(true)
    if (matrixTimeoutRef.current) clearTimeout(matrixTimeoutRef.current)
    matrixTimeoutRef.current = setTimeout(() => setShowMatrix(false), 6000)
  }, [])

  const triggerGlitch = useCallback(() => {
    setShowGlitch(true)
    if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current)
    glitchTimeoutRef.current = setTimeout(() => setShowGlitch(false), 300)
  }, [])

  const triggerParty = useCallback(() => {
    setPartyMode(true)
    if (partyTimeoutRef.current) clearTimeout(partyTimeoutRef.current)
    partyTimeoutRef.current = setTimeout(() => setPartyMode(false), 5000)
  }, [])

  const triggerMeow = useCallback(() => {
    setMeowMode(true)
  }, [])

  const showMessage = useCallback((msg: string, duration = 3000) => {
    setEasterEggMessage(msg)
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current)
    messageTimeoutRef.current = setTimeout(() => setEasterEggMessage(null), duration)
  }, [])

  const triggerFlip = useCallback(() => {
    document.body.style.transform = "rotate(180deg)"
    document.body.style.transition = "transform 0.5s"
    if (bodyTransformTimeoutRef.current) clearTimeout(bodyTransformTimeoutRef.current)
    bodyTransformTimeoutRef.current = setTimeout(() => {
      document.body.style.transform = ""
    }, 3000)
  }, [])

  const triggerSpin = useCallback(() => {
    document.body.style.transition = "transform 1s"
    document.body.style.transform = "rotate(360deg)"
    if (bodyTransformTimeoutRef.current) clearTimeout(bodyTransformTimeoutRef.current)
    bodyTransformTimeoutRef.current = setTimeout(() => {
      document.body.style.transform = ""
    }, 1000)
  }, [])

  return {
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
  }
}

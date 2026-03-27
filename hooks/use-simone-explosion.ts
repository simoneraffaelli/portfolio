import { useState, useCallback, useEffect, useRef, type RefObject } from "react"

// Keep in sync with the corresponding CSS animation durations.
const SIMONE_BLAST_DURATION_MS = 260
const SIMONE_MUTATION_START_DELAY_MS = 80
const SIMONE_EXPLOSION_DURATION_MS = 2600

export function useSimoneExplosion(contentRef: RefObject<HTMLDivElement | null>) {
  const [isLocked, setIsLocked] = useState(false)
  const animationRunning = useRef(false)
  const isMountedRef = useRef(true)
  const blastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  const reset = useCallback((unlockTerminal = true) => {
    if (blastTimeoutRef.current) {
      clearTimeout(blastTimeoutRef.current)
      blastTimeoutRef.current = null
    }
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current)
      startTimeoutRef.current = null
    }
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current)
      cleanupTimeoutRef.current = null
    }

    document.body.classList.remove("simone-blast-start")
    document.body.classList.remove("simone-explosion-active")
    document.body.classList.remove("simone-freeze-ui")

    if (overlayRef.current) {
      overlayRef.current.remove()
      overlayRef.current = null
    }

    window.__SIMONE_DOM_MODE__ = false
    animationRunning.current = false

    if (unlockTerminal && isMountedRef.current) {
      setIsLocked(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      reset(false)
    }
  }, [reset])

  const trigger = useCallback(() => {
    if (animationRunning.current) return false

    const contentRoot = contentRef.current
    if (!contentRoot) return false

    animationRunning.current = true
    setIsLocked(true)
    window.__SIMONE_DOM_MODE__ = true
    document.body.classList.add("simone-blast-start")

    const blastOverlay = document.createElement("div")
    blastOverlay.className = "simone-blast-overlay"
    document.body.appendChild(blastOverlay)
    overlayRef.current = blastOverlay

    blastTimeoutRef.current = setTimeout(() => {
      blastTimeoutRef.current = null
      document.body.classList.remove("simone-blast-start")
      if (overlayRef.current === blastOverlay) {
        blastOverlay.remove()
        overlayRef.current = null
      }
    }, SIMONE_BLAST_DURATION_MS)

    startTimeoutRef.current = setTimeout(() => {
      startTimeoutRef.current = null
      if (!contentRoot.isConnected) {
        reset()
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
          if (parent.closest("[data-simone-hide='true']")) return NodeFilter.FILTER_REJECT
          if (parent.namespaceURI === "http://www.w3.org/2000/svg" || parent.closest("svg")) {
            return NodeFilter.FILTER_REJECT
          }
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT
          return NodeFilter.FILTER_ACCEPT
        },
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
        if (!parent || !parent.contains(textNode)) return

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
        cleanupTimeoutRef.current = null

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

        reset()
      }

      cleanupTimeoutRef.current = setTimeout(cleanup, SIMONE_EXPLOSION_DURATION_MS)
    }, SIMONE_MUTATION_START_DELAY_MS)

    return true
  }, [contentRef, reset])

  return { isLocked, trigger }
}

"use client"

import { useState, useRef, useEffect } from "react"

interface TerminalInputProps {
  onCommand: (command: string) => { success: boolean; message?: string }
  disabled?: boolean
}

export function TerminalInput({ onCommand, disabled = false }: TerminalInputProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (disabled) {
      inputRef.current?.blur()
      return
    }

    inputRef.current?.focus()
  }, [disabled])

  // Refocus on click anywhere in the container
  const handleContainerClick = () => {
    if (disabled) return
    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled) return

    const trimmed = input.trim().toLowerCase()
    
    if (!trimmed) return

    const result = onCommand(trimmed)
    
    if (result.success) {
      setFeedback(result.message ? { text: result.message, type: "success" } : null)
    } else {
      setFeedback({ text: result.message || `command not found: ${trimmed}`, type: "error" })
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }

    setHistory(prev => [...prev, trimmed])
    setHistoryIndex(-1)
    setInput("")

    setTimeout(() => setFeedback(null), 3000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(history[history.length - 1 - newIndex] || "")
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(history[history.length - 1 - newIndex] || "")
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Simple autocomplete
      const commands = ["whoami", "projects", "contact", "help", "clear", "matrix", "theme", "light", "dark"]
      const match = commands.find(c => c.startsWith(input.toLowerCase()))
      if (match) setInput(match)
    }
  }

  return (
    <div 
      className={`px-4 sm:px-6 py-3 bg-background border-b border-border ${disabled ? "cursor-not-allowed opacity-80" : "cursor-text"}`}
      onClick={handleContainerClick}
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <span className="text-primary font-mono text-sm select-none shrink-0">
            visitor@portfolio:~$
          </span>
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type 'help' for commands..."
              className={`
                w-full bg-transparent font-mono text-sm text-foreground 
                placeholder:text-muted-foreground/40 outline-none
                ${isShaking ? "animate-shake" : ""}
              `}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              disabled={disabled}
            />
            <span className={`w-2 h-5 bg-primary/80 ml-0.5 shrink-0 ${disabled ? "opacity-0" : "animate-cursor"}`} />
          </div>
        </form>
        
        {/* Feedback message */}
        <div className="h-5 mt-1">
          {feedback && (
            <div 
              className={`
                text-xs font-mono animate-fade-in-up
                ${feedback.type === "success" ? "text-primary" : "text-destructive"}
              `}
            >
              {feedback.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

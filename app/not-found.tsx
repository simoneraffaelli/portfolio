"use client"

import { usePathname, useRouter } from "next/navigation"
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react"

type LogLine = {
  command: string
  response: string
  error?: boolean
}

const NAVIGATION_COMMANDS = new Set(["home", "cd /", "cd ~", "exit"])

export default function NotFound() {
  const pathname = usePathname()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState("")
  const [clock, setClock] = useState("--:--:--")
  const [date, setDate] = useState("----/--/--")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [responseTime, setResponseTime] = useState("calculating...")
  const [logs, setLogs] = useState<LogLine[]>([
    {
      command: "resolve --requested-route",
      response: "lookup failed: no matching resource was found",
      error: true,
    },
  ])

  const sessionId = useMemo(() => {
    const hash = Array.from(pathname).reduce(
      (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
      404,
    )

    return hash.toString(16).padStart(8, "0").slice(0, 8).toUpperCase()
  }, [pathname])

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now),
      )
      setDate(
        new Intl.DateTimeFormat("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(now),
      )
    }

    updateClock()
    const interval = window.setInterval(updateClock, 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
    const measuredResponseTime = navigation
      ? `${Math.max(1, Math.round(navigation.responseEnd - navigation.requestStart))} ms`
      : "unavailable"

    setResponseTime(measuredResponseTime)
  }, [])

  const addLog = (command: string, response: string, error = false) => {
    setLogs((current) => [...current.slice(-2), { command, response, error }])
  }

  const executeCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase()
    if (!command) return

    setHistory((current) => [...current, command])
    setHistoryIndex(-1)
    setInput("")

    if (NAVIGATION_COMMANDS.has(command)) {
      addLog(command, "route restored — returning to /home")
      window.setTimeout(() => router.push("/"), 220)
      return
    }

    switch (command) {
      case "help":
      case "?":
        addLog(command, "available: home · retry · pwd · clear · help")
        break
      case "pwd":
        addLog(command, pathname)
        break
      case "ls":
        addLog(command, "index -> /   status -> online")
        break
      case "clear":
      case "cls":
        setLogs([])
        break
      case "retry":
      case "reload":
        addLog(command, "retrying route resolution...")
        window.setTimeout(() => window.location.reload(), 220)
        break
      default:
        addLog(command, `zsh: command not found: ${command}`, true)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    executeCommand(input)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (!history.length) return
      const nextIndex = Math.min(historyIndex + 1, history.length - 1)
      setHistoryIndex(nextIndex)
      setInput(history[history.length - 1 - nextIndex] ?? "")
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (historyIndex <= 0) {
        setHistoryIndex(-1)
        setInput("")
        return
      }

      const nextIndex = historyIndex - 1
      setHistoryIndex(nextIndex)
      setInput(history[history.length - 1 - nextIndex] ?? "")
    }

    if (event.key === "Tab") {
      event.preventDefault()
      const commands = ["home", "retry", "pwd", "clear", "help"]
      const match = commands.find((command) => command.startsWith(input.toLowerCase()))
      if (match) setInput(match)
    }
  }

  return (
    <div className="not-found-shell h-dvh w-screen overflow-hidden bg-background font-mono text-foreground">
      <div className="not-found-grid" aria-hidden="true" />
      <div className="not-found-scanline" aria-hidden="true" />

      <header className="relative z-10 flex h-12 items-center justify-between border-b border-border bg-card/50 px-4 sm:px-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-primary">~</span>
          <span className="hidden text-muted-foreground sm:inline">/dev/</span>
          <span className="hidden font-medium text-foreground sm:inline">portfolio</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive shadow-[0_0_12px_var(--destructive)]" />
          route_unresolved
        </div>
      </header>

      <main className="relative z-10 mx-auto grid h-[calc(100dvh-5.5rem)] w-full max-w-7xl grid-rows-[auto_1fr_auto] px-4 sm:px-6">
        <div className="grid grid-cols-2 border-x border-b border-border/70 text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:grid-cols-3 sm:text-xs lg:grid-cols-5">
          <Diagnostic label="error" value="404 / not_found" emphasis />
          <Diagnostic label="session" value={sessionId} />
          <Diagnostic label="date" value={date} />
          <Diagnostic label="local time" value={clock} />
          <Diagnostic label="response time" value={responseTime} />
        </div>

        <section className="grid min-h-0 grid-cols-1 border-x border-border/70 lg:grid-cols-12">
          <div className="flex min-h-0 flex-col border-b border-border/70 px-4 py-6 sm:px-8 sm:py-8 lg:col-span-8 lg:border-b-0 lg:border-r">
            <div>
              <p className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                <span className="text-primary">//</span>
                exception.report
              </p>
              <h1 className="not-found-code select-none text-[clamp(5.5rem,18vw,13rem)] font-semibold leading-[0.72] tracking-[-0.09em] text-foreground">
                404
              </h1>
              <div className="mt-7 max-w-2xl border-l border-primary/70 pl-4 sm:mt-10 sm:pl-6">
                <p className="text-xl font-medium tracking-tight sm:text-3xl">
                  Page missing<span className="animate-cursor text-primary">_</span>
                </p>
                <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground sm:text-base">
                  The requested route slipped outside the project tree. The portfolio is still online — this path just isn&apos;t.
                </p>
              </div>
            </div>

          </div>

          <aside className="hidden min-h-0 flex-col justify-between p-6 lg:col-span-4 lg:flex">
            <div className="space-y-7 text-[11px] uppercase leading-relaxed tracking-[0.08em]">
              <StatusBlock title="requested resource">
                <span className="break-all text-foreground">{pathname}</span>
              </StatusBlock>
              <StatusBlock title="resolver output">
                <span className="text-destructive">warning: route not found</span>
                <br />
                no component matched the requested URI.
              </StatusBlock>
              <StatusBlock title="recovery candidates">
                01 / return to root
                <br />
                02 / verify the URL
                <br />
                03 / run &quot;help&quot;
              </StatusBlock>
            </div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              status: <span className="text-primary">portfolio online</span>
            </div>
          </aside>
        </section>

        <section
          className="h-24 border border-border/70 bg-card/50 px-3 py-2.5 sm:px-4"
          onClick={() => inputRef.current?.focus()}
          aria-label="Recovery terminal"
        >
          <div className="mb-1 flex h-[3.25rem] flex-col justify-end gap-0.5 overflow-hidden text-[10px] leading-relaxed">
            {logs.map((log, index) => (
              <div key={`${log.command}-${index}`} className="truncate text-muted-foreground">
                {log.command}
                <span className={log.error ? "ml-3 text-destructive" : "ml-3 text-foreground/70"}>
                  {log.response}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-2 text-xs sm:text-sm">
            <label htmlFor="recovery-command" className="shrink-0 text-primary">
              <span className="hidden sm:inline">visitor@portfolio:</span>~$
            </label>
            <input
              ref={inputRef}
              id="recovery-command"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              className="min-w-0 flex-1 bg-transparent text-foreground caret-transparent outline-none placeholder:text-muted-foreground/50"
              placeholder="type 'help' or 'home'..."
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-describedby="recovery-hint"
            />
            <span className="h-4 w-2 shrink-0 bg-primary animate-cursor" aria-hidden="true" />
            <button
              type="submit"
              className="sr-only"
              aria-label="Run recovery command"
            >
              Run
            </button>
          </form>
          <p id="recovery-hint" className="sr-only">
            Type help to list available commands. Use the up and down arrows to browse command history.
          </p>
        </section>
      </main>

      <footer className="relative z-10 flex h-10 items-center border-t border-border bg-card/30 px-4 text-[10px] text-muted-foreground sm:px-6 sm:text-xs">
        <span><span className="text-primary">$</span> exception handled safely</span>
      </footer>
    </div>
  )
}

function Diagnostic({
  label,
  value,
  emphasis = false,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <div className="min-w-0 border-r border-border/70 px-3 py-2.5 last:border-r-0 sm:px-4">
      <span className="block opacity-55">{label}</span>
      <span className={`mt-1 block truncate ${emphasis ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  )
}

function StatusBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-primary">// {title}</p>
      <p className="text-muted-foreground">{children}</p>
    </div>
  )
}

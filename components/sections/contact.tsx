"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { siGithub, siX, siBluesky, siLinktree } from "simple-icons"

import { SimpleIcon } from "@/components/ui/simple-icon"

const links = [
  { label: "GitHub", href: "https://github.com/simoneraffaelli", handle: "@simoneraffaelli", icon: siGithub },
  { label: "X", href: "https://twitter.com/simonefyi", handle: "@simonefyi", icon: siX },
  { label: "Bluesky", href: "https://bsky.app/profile/simone.fyi", handle: "@simone.fyi", icon: siBluesky },
  { label: "Linktree", href: "https://linktr.ee/simone.fyi", handle: "simone.fyi", icon: siLinktree },
]

const email = "ciao@simone.ooo"

export function ContactSection() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [copied, setCopied] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const totalLines = 6

  // Reveal lines one by one
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
  }, [])

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full min-h-0 flex flex-col overflow-y-auto overflow-x-hidden pr-2 pb-4 terminal-scrollbar">
      <div className="mb-6 sm:mb-8">
        <p 
          className="text-muted-foreground text-sm font-mono mb-2 terminal-line"
          style={{ animationDelay: "0ms", opacity: visibleLines >= 1 ? 1 : 0 }}
        >
          <span className="text-primary">//</span> get in touch
        </p>
        <h2 
          className="text-2xl font-medium tracking-tight text-foreground mb-4 terminal-line"
          style={{ animationDelay: "80ms", opacity: visibleLines >= 1 ? 1 : 0 }}
        >
          Contact
        </h2>
        <p 
          className="text-muted-foreground leading-relaxed max-w-lg terminal-line"
          style={{ animationDelay: "160ms", opacity: visibleLines >= 2 ? 1 : 0 }}
        >
          I&apos;m always interested in hearing about new projects and opportunities. 
          Feel free to reach out if you want to collaborate or just say hello.
        </p>
      </div>

      {/* Email */}
      <div 
        className="mb-8 terminal-line"
        style={{ animationDelay: "240ms", opacity: visibleLines >= 3 ? 1 : 0 }}
      >
        <p className="text-xs font-mono text-primary mb-3 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-px bg-primary" />
          Email
        </p>
        <button
          onClick={copyEmail}
          className="group flex flex-wrap items-center gap-3 text-lg text-foreground hover:text-primary transition-all duration-200"
        >
          <span className="font-mono relative break-all">
            {email}
            <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
          </span>
          <span className={`
            transition-all duration-200
            ${copied ? "scale-110" : "opacity-0 group-hover:opacity-100"}
          `}>
            {copied ? (
              <Check className="w-4 h-4 text-primary animate-bounce-subtle" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </span>
        </button>
        <p className={`
          text-xs text-primary mt-2 font-mono transition-all duration-200
          ${copied ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}
        `}>
          copied to clipboard
        </p>
      </div>

      {/* Links */}
      <div 
        className="flex-1 terminal-line"
        style={{ animationDelay: "320ms", opacity: visibleLines >= 4 ? 1 : 0 }}
      >
        <p className="text-xs font-mono text-primary mb-3 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-px bg-primary" />
          Links
        </p>
        <div className="space-y-2">
          {links.map((link) => {
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-3 px-3 -mx-3 rounded-lg transition-all duration-200 hover:bg-card"
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <SimpleIcon
                    icon={link.icon}
                    title={link.label}
                    className={`
                      w-4 h-4 transition-all duration-200
                      ${hoveredLink === link.label ? "text-primary scale-110" : "text-muted-foreground"}
                    `}
                  />
                  <span className="text-foreground shrink-0">{link.label}</span>
                  <span className="text-sm text-muted-foreground font-mono break-all [overflow-wrap:anywhere]">{link.handle}</span>
                </div>
                <ArrowUpRight className={`
                  w-4 h-4 transition-all duration-200
                  ${hoveredLink === link.label 
                    ? "text-primary translate-x-0.5 -translate-y-0.5 opacity-100" 
                    : "text-muted-foreground opacity-0"
                  }
                `} />
              </a>
            )
          })}
        </div>
      </div>

      {/* Terminal-style response */}
      <div 
        className="mt-auto pt-6 terminal-line"
        style={{ animationDelay: "400ms", opacity: visibleLines >= 5 ? 1 : 0 }}
      >
        <div className="p-4 bg-card rounded-lg border border-border font-mono text-sm overflow-hidden">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <span className="text-primary">$</span>
            <span>curl status.json</span>
          </div>
          <div className="text-foreground">
            <span className="text-primary">{"{"}</span>
            <br />
            <span className="ml-4">&quot;available&quot;: <span className="text-primary">true</span>,</span>
            <br />
            <span className="ml-4">&quot;response_time&quot;: <span className="text-muted-foreground">&quot;&lt; 24h&quot;</span>,</span>
            <br />
            <span className="ml-4">&quot;timezone&quot;: <span className="text-muted-foreground">&quot;UTC+1&quot;</span></span>
            <br />
            <span className="text-primary">{"}"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

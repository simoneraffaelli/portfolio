"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { siGithub } from "simple-icons"

import { SimpleIcon } from "@/components/ui/simple-icon"

const year = new Date().getFullYear()
const projects = [
  {
    id: "01",
    title: "My Lenses",
    description: "A native android application for tracking the expiration of your contact lenses.",
    tech: ["Kotlin", "SQLite", "Android Framework", "Material Design"],
    link: "https://mylenses.app",
    github: "https://github.com/simoneraffaelli/MyLenses",
    year: "2020-2023",
  },
  {
    id: "02",
    title: "Unredacted",
    description: "______________________________________________________________________________",
    tech: ["HTML", "CSS", "NFT", "Web3"],
    link: "https://unredacted.art/",
    github: "#",
    year: "2023",
  },
  {
    id: "03",
    title: "Portfolio Website",
    description: "My presentation, lol.",
    tech: ["Next.js", "Three.js", "Google Stitch", "Tailwind CSS"],
    link: "https://simone.ooo",
    github: "https://github.com/simoneraffaelli/raffaelli.me",
    year: `2019-${year}`,
  },
    {
    id: "04",
    title: "Vibe Scout",
    description: "Android and web application inspired by Riley Walttz's Bop Spotter. It's music surveillance, without consent. Built for fun and learning, not profit. Don't worry, it doesn't actually track anyone. Open sourced.",
    tech: ["Next.js", "Kotlin", "Android Framework", "Rust"],
    link: "https://vibescout.simone.ooo",
    github: "https://github.com/simoneraffaelli/vibescout-web",
    year: `2026`,
  }
]

export function ProjectsSection() {
  const [showContent, setShowContent] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Fade in content
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`
      h-full min-h-0 flex flex-col overflow-hidden
      transition-opacity duration-300 ease-out
      ${showContent ? "opacity-100" : "opacity-0"}
    `}>
      <div className="mb-4 sm:mb-6 flex-shrink-0">
        <p className="text-muted-foreground text-sm font-mono mb-2">
          <span className="text-primary">//</span> selected work
        </p>
        <h2 className="text-2xl font-medium tracking-tight text-foreground">
          Projects
        </h2>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto overflow-x-hidden pr-2 pb-4 terminal-scrollbar">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="transition-all duration-300"
            style={{ 
              transitionDelay: `${index * 50}ms`,
              opacity: showContent ? 1 : 0,
              transform: showContent ? "translateY(0)" : "translateY(8px)"
            }}
          >
            <div
              className={`
                group relative p-4 -mx-2 sm:-mx-4 rounded-lg transition-all duration-300 cursor-pointer
                ${hoveredId === project.id || expandedId === project.id 
                  ? "bg-card" 
                  : "hover:bg-card/50"
                }
              `}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
            >
              <div className="flex items-start justify-between gap-4 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`
                      text-xs font-mono transition-colors duration-200
                      ${hoveredId === project.id ? "text-primary" : "text-muted-foreground"}
                    `}>
                      {project.id}
                    </span>
                    <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight 
                      className={`
                        w-4 h-4 transition-all duration-200
                        ${hoveredId === project.id 
                          ? "opacity-100 translate-x-0.5 -translate-y-0.5 text-primary" 
                          : "opacity-0 text-muted-foreground"
                        }
                      `} 
                    />
                  </div>
                  <p className={`
                    text-sm text-muted-foreground leading-relaxed mb-3 transition-all duration-300 break-words [overflow-wrap:anywhere]
                    ${expandedId === project.id ? "" : "line-clamp-2"}
                  `}>
                    {project.description}
                  </p>
                  
                  {/* Tech tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {project.tech.map((t, i) => (
                      <span 
                        key={t} 
                        className={`
                          text-xs font-mono px-2 py-0.5 rounded transition-all duration-200
                          ${hoveredId === project.id 
                            ? "bg-primary/10 text-primary" 
                            : "bg-secondary text-secondary-foreground"
                          }
                        `}
                        style={{ 
                          transitionDelay: hoveredId === project.id ? `${i * 30}ms` : "0ms"
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Expanded links */}
                  {expandedId === project.id && (
                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors min-w-0"
                      >
                        <SimpleIcon icon={siGithub} title="GitHub" className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    </div>
                  )}
                </div>
                <span className="text-xs font-mono text-muted-foreground shrink-0">
                  {project.year}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

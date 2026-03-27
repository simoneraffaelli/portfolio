"use client"

import { useEffect, useState } from "react"

const characters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF"

interface Drop {
  id: number
  x: number
  delay: number
  duration: number
  chars: string[]
}

export function MatrixRain() {
  const [drops, setDrops] = useState<Drop[]>([])

  useEffect(() => {
    const columns = Math.floor(window.innerWidth / 20)
    const newDrops: Drop[] = []
    
    for (let i = 0; i < columns; i++) {
      const chars = Array.from({ length: 20 }, () => 
        characters[Math.floor(Math.random() * characters.length)]
      )
      newDrops.push({
        id: i,
        x: i * 20,
        delay: Math.random() * 2,
        duration: 1.5 + Math.random() * 1.5,
        chars,
      })
    }
    
    setDrops(newDrops)
  }, [])

  return (
    <div className="fixed inset-0 z-40 overflow-hidden pointer-events-none bg-background/80">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute top-0 font-mono text-sm text-primary"
          style={{
            left: drop.x,
            animation: `matrix-fall ${drop.duration}s linear ${drop.delay}s infinite`,
          }}
        >
          {drop.chars.map((char, i) => (
            <div 
              key={i} 
              className="h-5"
              style={{ 
                opacity: 1 - (i * 0.05),
                textShadow: i === 0 ? "0 0 10px currentColor" : "none"
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

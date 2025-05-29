"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ParticleProps {
  active: boolean
}

export default function Particles({ active }: ParticleProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      color: string
      delay: number
    }>
  >([])

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 2,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.5 + 0.2})`,
        delay: Math.random() * 0.5,
      }))

      setParticles(newParticles)
    } else {
      setParticles([])
    }
  }, [active])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn("absolute rounded-full", active ? "animate-particle-in" : "animate-particle-out")}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

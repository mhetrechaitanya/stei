// NOTE: This component may need to be removed or modified as wave designs are being removed from the site
"use client"

import { useEffect, useRef } from "react"

interface WaveAnimationProps {
  active: boolean
  color?: string
  speed?: number
  amplitude?: number
  frequency?: number
}

export default function WaveAnimation({
  active,
  color = "#D40F14",
  speed = 0.05,
  amplitude = 20,
  frequency = 0.02,
}: WaveAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const timeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = 200
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation function
    const animate = (time: number) => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update time
      timeRef.current += speed

      // Draw waves
      ctx.beginPath()

      // Start at the left edge, slightly below the top
      ctx.moveTo(0, 40)

      // Draw the wave
      for (let x = 0; x < canvas.width; x++) {
        // Multiple sine waves with different frequencies and amplitudes
        const y =
          Math.sin(x * frequency + timeRef.current) * amplitude * (active ? 1 : 0.5) +
          Math.sin(x * frequency * 0.5 + timeRef.current * 1.5) * amplitude * 0.5 * (active ? 1 : 0.3) +
          40 // Offset from top

        ctx.lineTo(x, y)
      }

      // Complete the path down and around to make a closed shape
      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()

      // Fill with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, `${color}CC`) // Semi-transparent at top
      gradient.addColorStop(1, `${color}33`) // More transparent at bottom

      ctx.fillStyle = gradient
      ctx.fill()

      // Request next frame
      requestRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    requestRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [active, color, speed, amplitude, frequency])

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 left-0 right-0 pointer-events-none z-30"
      style={{
        opacity: active ? 1 : 0,
        transition: "opacity 1s ease-in-out",
      }}
    />
  )
}

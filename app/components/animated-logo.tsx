"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

export default function AnimatedLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 160
    canvas.height = 60

    // Draw the logo
    const drawLogo = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw "stei" text
      ctx.font = "bold 32px serif"
      ctx.fillStyle = "black"
      ctx.textBaseline = "middle"
      ctx.fillText("stei", 10, 20)

      // Draw red dot above the "i"
      ctx.beginPath()
      ctx.arc(120, 8, 6, 0, Math.PI * 2)
      ctx.fillStyle = "#D40F14"
      ctx.fill()

      // Draw red underline
      ctx.beginPath()
      ctx.moveTo(10, 40)
      ctx.lineTo(140, 40)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#D40F14"
      ctx.stroke()

      // Draw "EMPOWERING INDIVIDUALS" text
      ctx.font = "bold 10px sans-serif"
      ctx.fillStyle = "black"
      ctx.fillText("EMPOWERING INDIVIDUALS", 10, 50)
    }

    drawLogo()
  }, [])

  return (
    <Link href="/" className="flex items-center">
      <canvas
        ref={canvasRef}
        width={160}
        height={60}
        className="h-14"
        aria-label="stei Logo - Empowering Individuals"
      />
    </Link>
  )
}

"use client"

import { useEffect, useRef } from "react"

export default function RotatingLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const size = 150
    canvas.width = size
    canvas.height = size

    // Function to draw the logo
    const drawLogo = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw outer circle
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2 - 5, 0, Math.PI * 2)
      ctx.lineWidth = 3
      ctx.strokeStyle = "#D40F14"
      ctx.stroke()

      // Draw "STEI" text in center
      ctx.font = "bold 32px serif"
      ctx.fillStyle = "black"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("STEI", size / 2, size / 2)

      // Save context for rotating text
      ctx.save()

      // Set up for circular text
      ctx.translate(size / 2, size / 2)

      // Draw "EMPOWERING INDIVIDUALS" text around the circle
      const text = "EMPOWERING INDIVIDUALS"
      const radius = size / 2 - 20
      ctx.font = "bold 10px sans-serif"

      // Draw each character of the text
      for (let i = 0; i < text.length; i++) {
        const angle = i * ((Math.PI * 2) / text.length) - Math.PI / 2
        ctx.save()
        ctx.rotate(angle)
        ctx.translate(0, -radius)
        ctx.rotate(Math.PI / 2)
        ctx.fillText(text[i], 0, 0)
        ctx.restore()
      }

      // Restore context
      ctx.restore()
    }

    drawLogo()
  }, [])

  return (
    <div className="inline-block animate-spin-slow">
      <canvas
        ref={canvasRef}
        width={150}
        height={150}
        className="h-[150px] w-[150px]"
        aria-label="STEI - Empowering Individuals"
      />
    </div>
  )
}

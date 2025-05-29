"use client"

import { useEffect, useRef } from "react"

interface MorphingBlobProps {
  active: boolean
  color?: string
  size?: number
  position?: { x: number; y: number }
}

export default function MorphingBlob({
  active,
  color = "#D40F14",
  size = 300,
  position = { x: 50, y: 50 },
}: MorphingBlobProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const requestRef = useRef<number>()
  const timeRef = useRef<number>(0)

  useEffect(() => {
    if (!active) return

    const svg = svgRef.current
    const path = pathRef.current
    if (!svg || !path) return

    // Animation function
    const animate = () => {
      timeRef.current += 0.01

      // Generate blob path
      const points = 8
      const radius = size / 2
      const center = { x: position.x, y: position.y }

      let pathData = `M ${center.x + radius * Math.cos(0)},${center.y + radius * Math.sin(0)} `

      for (let i = 1; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2
        const noise = Math.sin(timeRef.current * 2 + i * 3) * 30
        const x = center.x + (radius + noise) * Math.cos(angle)
        const y = center.y + (radius + noise) * Math.sin(angle)

        const prevAngle = ((i - 1) / points) * Math.PI * 2
        const prevX = center.x + (radius + Math.sin(timeRef.current * 2 + (i - 1) * 3) * 30) * Math.cos(prevAngle)
        const prevY = center.y + (radius + Math.sin(timeRef.current * 2 + (i - 1) * 3) * 30) * Math.sin(prevAngle)

        const cpX1 = prevX + (x - prevX) * 0.5 - (y - prevY) * 0.2
        const cpY1 = prevY + (y - prevY) * 0.5 + (x - prevX) * 0.2

        pathData += `Q ${cpX1},${cpY1} ${x},${y} `
      }

      pathData += "Z"
      path.setAttribute("d", pathData)

      requestRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    requestRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [active, size, position])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      style={{
        opacity: active ? 0.7 : 0,
        transition: "opacity 1s ease-in-out",
      }}
    >
      <defs>
        <filter id="gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
        </filter>
      </defs>
      <g filter="url(#gooey)">
        <path ref={pathRef} fill={color} opacity="0.7" />
      </g>
    </svg>
  )
}

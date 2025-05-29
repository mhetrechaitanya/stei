"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"

interface ParallaxLayerProps {
  children: ReactNode
  depth?: number
  className?: string
}

export default function ParallaxLayer({ children, depth = 20, className = "" }: ParallaxLayerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!layerRef.current) return

      const { left, top, width, height } = layerRef.current.getBoundingClientRect()

      // Calculate mouse position relative to the center of the element
      const x = ((e.clientX - left) / width - 0.5) * 2
      const y = ((e.clientY - top) / height - 0.5) * 2

      // Apply parallax effect based on depth
      setPosition({
        x: x * depth,
        y: y * depth,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [depth])

  return (
    <div
      ref={layerRef}
      className={className}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  )
}

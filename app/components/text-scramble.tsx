"use client"

import { useState, useEffect, useRef } from "react"

interface TextScrambleProps {
  text: string
  className?: string
}

export default function TextScramble({ text, className = "" }: TextScrambleProps) {
  const [output, setOutput] = useState("")
  const [isScrambling, setIsScrambling] = useState(false)
  const chars = "!<>-_\\/[]{}—=+*^?#________"
  const frameRequestRef = useRef<number>()
  const queueRef = useRef<string[]>([])
  const frameRef = useRef(0)

  useEffect(() => {
    if (isScrambling) return

    setIsScrambling(true)
    queueRef.current = [text]

    const update = () => {
      let complete = 0
      let currentOutput = output

      for (let i = 0; i < currentOutput.length; i++) {
        if (i >= text.length) {
          complete++
          continue
        }

        if (currentOutput[i] === text[i]) {
          complete++
          continue
        }

        if (frameRef.current % 3 === 0) {
          const randomChar = chars[Math.floor(Math.random() * chars.length)]
          currentOutput = currentOutput.substring(0, i) + randomChar + currentOutput.substring(i + 1)
        }
      }

      // Add characters if needed
      if (currentOutput.length < text.length && frameRef.current % 3 === 0) {
        const randomChar = chars[Math.floor(Math.random() * chars.length)]
        currentOutput += randomChar
      }

      // Replace with actual characters
      if (frameRef.current % 3 === 0) {
        for (let i = 0; i < text.length; i++) {
          if (currentOutput[i] === text[i]) continue

          if (Math.random() < 0.1) {
            currentOutput = currentOutput.substring(0, i) + text[i] + currentOutput.substring(i + 1)
            complete++
          }
        }
      }

      setOutput(currentOutput)
      frameRef.current++

      if (complete === text.length) {
        setIsScrambling(false)
        return
      }

      frameRequestRef.current = requestAnimationFrame(update)
    }

    frameRequestRef.current = requestAnimationFrame(update)

    return () => {
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current)
      }
    }
  }, [text])

  return <span className={className}>{output}</span>
}

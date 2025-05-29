"use client"

import { useEffect } from "react"

export default function DebugLogger() {
  useEffect(() => {
    // Save the original console.error
    const originalConsoleError = console.error

    // Override console.error to log to both console and UI
    console.error = (...args) => {
      // Call the original console.error
      originalConsoleError.apply(console, args)

      // Create a visible error message for debugging
      const errorDiv = document.createElement("div")
      errorDiv.style.position = "fixed"
      errorDiv.style.bottom = "10px"
      errorDiv.style.right = "10px"
      errorDiv.style.backgroundColor = "rgba(255, 0, 0, 0.8)"
      errorDiv.style.color = "white"
      errorDiv.style.padding = "10px"
      errorDiv.style.borderRadius = "5px"
      errorDiv.style.maxWidth = "80%"
      errorDiv.style.zIndex = "9999"
      errorDiv.style.fontSize = "12px"
      errorDiv.style.maxHeight = "200px"
      errorDiv.style.overflow = "auto"

      // Format the error message
      let errorMessage = ""
      args.forEach((arg) => {
        if (arg instanceof Error) {
          errorMessage += `${arg.name}: ${arg.message}\n${arg.stack}\n`
        } else if (typeof arg === "object") {
          try {
            errorMessage += JSON.stringify(arg, null, 2) + "\n"
          } catch (e) {
            errorMessage += arg + "\n"
          }
        } else {
          errorMessage += arg + "\n"
        }
      })

      errorDiv.textContent = errorMessage

      // Add a close button
      const closeButton = document.createElement("button")
      closeButton.textContent = "X"
      closeButton.style.position = "absolute"
      closeButton.style.top = "5px"
      closeButton.style.right = "5px"
      closeButton.style.backgroundColor = "transparent"
      closeButton.style.border = "none"
      closeButton.style.color = "white"
      closeButton.style.cursor = "pointer"
      closeButton.onclick = () => {
        document.body.removeChild(errorDiv)
      }

      errorDiv.appendChild(closeButton)
      document.body.appendChild(errorDiv)

      // Remove the error message after 30 seconds
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv)
        }
      }, 30000)
    }

    // Restore the original console.error on cleanup
    return () => {
      console.error = originalConsoleError
    }
  }, [])

  return null
}

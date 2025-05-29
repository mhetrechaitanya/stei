"use client"

import type React from "react"

import { useEffect, useState } from "react"

export default function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("Error caught by error boundary:", event.error)
      setHasError(true)
      // Prevent the error from propagating
      event.preventDefault()
    }

    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  if (hasError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <h3 className="text-lg font-medium text-red-800 mb-2">Something went wrong</h3>
        <p className="text-red-600">We're having trouble loading this content. Please try refreshing the page.</p>
      </div>
    )
  }

  return <>{children}</>
}

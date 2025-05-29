"use client"

import type React from "react"
import { useEffect, useState } from "react"

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    // Handle runtime errors
    const errorHandler = (event: ErrorEvent) => {
      console.error("Error caught by error boundary:", event.error)
      setHasError(true)
      setErrorMessage(event.error?.message || "An unknown error occurred")
      // Prevent the error from bubbling up
      event.preventDefault()
    }

    // Handle promise rejections
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error("Promise rejection caught by error boundary:", event.reason)
      setHasError(true)
      setErrorMessage(event.reason?.message || "A promise was rejected")
      // Prevent the rejection from bubbling up
      event.preventDefault()
    }

    window.addEventListener("error", errorHandler)
    window.addEventListener("unhandledrejection", rejectionHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
      window.removeEventListener("unhandledrejection", rejectionHandler)
    }
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            We're sorry, but there was an error loading this page. Please try refreshing the page or contact support if
            the problem persists.
          </p>
          {errorMessage && (
            <div className="bg-red-50 p-4 rounded-md mb-4">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setHasError(false)
                window.location.reload()
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => {
                setHasError(false)
              }}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

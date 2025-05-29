"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function WorkshopsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
          <p className="text-gray-600 mb-6">
            We encountered an error while loading the workshops. Please try again later.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => reset()}
              className="bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-6 rounded-full transition-all duration-300"
            >
              Try again
            </button>
            <Link
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-full transition-all duration-300"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

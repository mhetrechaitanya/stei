"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function WorkshopInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const initializeWorkshops = async () => {
    setIsInitializing(true)
    setError(null)

    try {
      // Force a fresh fetch of workshops which will create the table and sample data if needed
      const response = await fetch("/api/workshops", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "x-initialize": "true", // Custom header to signal initialization
        },
      })

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${await response.text()}`)
      }

      const data = await response.json()

      setResult({
        success: true,
        message: "Workshops initialized successfully",
        count: Array.isArray(data) ? data.length : 0,
        timestamp: new Date().toISOString(),
      })

      // Reload the page after successful initialization
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    } catch (err) {
      setError(`Error initializing workshops: ${err.message}`)
      console.error("Initialization error:", err)

      setResult({
        success: false,
        message: "Failed to initialize workshops",
        error: err.message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Workshop Initialization</h2>
      <p className="mb-4 text-gray-600">
        If workshops are not showing up, click the button below to initialize the workshops database. This will create
        the necessary tables and sample data if they don't exist.
      </p>

      <Button onClick={initializeWorkshops} disabled={isInitializing} className="mb-4 bg-[#D40F14] hover:bg-[#B00D11]">
        {isInitializing ? "Initializing..." : "Initialize Workshops"}
      </Button>

      {error && <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

      {result && (
        <div
          className={`p-4 rounded border ${result.success ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}
        >
          <h3 className="font-medium">{result.message}</h3>
          {result.success && <p>Created {result.count} workshop(s)</p>}
          <p className="text-sm mt-2">Timestamp: {result.timestamp}</p>

          {result.success && <p className="mt-2 italic">Page will reload in 3 seconds...</p>}
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"

interface DebugPanelProps {
  data: any
  title?: string
}

export default function DebugPanel({ data, title = "Debug Information" }: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm"
      >
        {isExpanded ? "Hide Debug" : "Show Debug"}
      </button>

      {isExpanded && (
        <div className="mt-2 p-4 bg-gray-800 text-white rounded-md max-w-md max-h-96 overflow-auto">
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"

interface BatchDebugProps {
  workshop: any
  batches: any[]
}

export default function BatchDebug({ workshop, batches }: BatchDebugProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!workshop || !batches) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
        <p className="text-yellow-800 font-medium">Debug Info: No workshop or batch data available</p>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-4">
      <div className="flex justify-between items-center">
        <p className="text-blue-800 font-medium">Workshop & Batch Debug Info</p>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-600 hover:text-blue-800 text-sm">
          {isExpanded ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 text-sm">
          <p>
            <strong>Workshop ID:</strong> {workshop.id}
          </p>
          <p>
            <strong>Workshop Title:</strong> {workshop.title}
          </p>
          <p>
            <strong>Batches Count:</strong> {batches.length}
          </p>

          {batches.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium">Batch Data:</p>
              <pre className="bg-white p-2 rounded mt-1 overflow-auto max-h-40 text-xs">
                {JSON.stringify(batches, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="mt-2 text-red-600">No batches available for this workshop</p>
          )}
        </div>
      )}
    </div>
  )
}

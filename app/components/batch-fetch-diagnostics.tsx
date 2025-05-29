"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface BatchFetchDiagnosticsProps {
  workshopId: string
}

export default function BatchFetchDiagnostics({ workshopId }: BatchFetchDiagnosticsProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rawBatches, setRawBatches] = useState<any[]>([])
  const [apiResponse, setApiResponse] = useState<any>(null)

  // Fetch directly from Supabase
  useEffect(() => {
    async function fetchBatchesDirectly() {
      try {
        setLoading(true)
        const supabase = createClientComponentClient()

        // Fetch batches directly from Supabase
        const { data, error } = await supabase.from("workshop_batches").select("*").eq("workshop_id", workshopId)

        if (error) {
          throw error
        }

        setRawBatches(data || [])
      } catch (err) {
        console.error("Error fetching batches directly:", err)
        setError(err.message || "Failed to fetch batches directly")
      } finally {
        setLoading(false)
      }
    }

    // Fetch from API
    async function fetchBatchesFromApi() {
      try {
        const response = await fetch(`/api/workshops/${workshopId}`)
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        const data = await response.json()
        setApiResponse(data)
      } catch (err) {
        console.error("Error fetching from API:", err)
        setError((prev) => (prev ? `${prev}; API error: ${err.message}` : `API error: ${err.message}`))
      }
    }

    if (workshopId) {
      fetchBatchesDirectly()
      fetchBatchesFromApi()
    }
  }, [workshopId])

  return (
    <div className="p-4 bg-gray-50 rounded-lg text-sm">
      <h3 className="font-bold mb-2">Batch Fetch Diagnostics</h3>

      {loading && <p className="text-blue-600">Loading batches...</p>}

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Direct Supabase Query</h4>
          <p className="mb-1">Found {rawBatches.length} batches</p>

          {rawBatches.length > 0 ? (
            <details>
              <summary className="cursor-pointer text-blue-600">View Raw Batches</summary>
              <pre className="mt-2 p-2 bg-white rounded overflow-auto max-h-60 text-xs">
                {JSON.stringify(rawBatches, null, 2)}
              </pre>
            </details>
          ) : (
            <p className="text-orange-600">No batches found for this workshop</p>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-2">API Response</h4>
          {apiResponse ? (
            <>
              <p className="mb-1">Workshop: {apiResponse.title || "N/A"}</p>
              <p className="mb-1">Batches: {apiResponse.batches?.length || 0}</p>

              <details>
                <summary className="cursor-pointer text-blue-600">View API Response</summary>
                <pre className="mt-2 p-2 bg-white rounded overflow-auto max-h-60 text-xs">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </details>
            </>
          ) : (
            <p className="text-orange-600">No API response yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function DatabaseStructureFixer() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFixing, setIsFixing] = useState(false)
  const [fixResult, setFixResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/diagnose-db-structure")
      const data = await response.json()

      if (data.success) {
        setDiagnostics(data.diagnostics)
      } else {
        setError(data.message || "Failed to run diagnostics")
      }
    } catch (err) {
      setError("Error running diagnostics: " + (err.message || "Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }

  const fixDatabaseStructure = async () => {
    setIsFixing(true)
    setError(null)
    setFixResult(null)

    try {
      const response = await fetch("/api/fix-db-structure", {
        method: "POST",
      })
      const data = await response.json()

      setFixResult(data)

      if (data.success) {
        // Re-run diagnostics after fixing
        await runDiagnostics()
      } else {
        setError(data.message || "Failed to fix database structure")
      }
    } catch (err) {
      setError("Error fixing database structure: " + (err.message || "Unknown error"))
    } finally {
      setIsFixing(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Database Structure Diagnostics</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 text-gray-500 animate-spin" />
          <span className="ml-3 text-gray-600">Running diagnostics...</span>
        </div>
      ) : diagnostics ? (
        <div className="space-y-6">
          <div className="p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
            <div className="flex items-center">
              {diagnostics.connection ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700">Database connection successful</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">Database connection failed</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-2">Students Table</h2>
            <div className="flex items-center mb-4">
              {diagnostics.tables.students.exists ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700">Table exists</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">Table does not exist</span>
                </>
              )}
            </div>

            {diagnostics.tables.students.exists && (
              <div>
                <h3 className="text-md font-medium mb-2">Columns</h3>
                {diagnostics.tables.students.columns.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Column Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data Type
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nullable
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {diagnostics.tables.students.columns.map((column, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {column.column_name}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{column.data_type}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{column.is_nullable}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No columns found</p>
                )}
              </div>
            )}
          </div>

          {diagnostics.errors.length > 0 && (
            <div className="p-4 border rounded-md bg-red-50">
              <h2 className="text-lg font-semibold mb-2">Errors</h2>
              <ul className="list-disc pl-5 space-y-1">
                {diagnostics.errors.map((err, index) => (
                  <li key={index} className="text-red-700">
                    <span className="font-medium">{err.type}:</span> {err.message}
                    {err.code && <span className="text-xs ml-1">({err.code})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={runDiagnostics}
              disabled={isLoading || isFixing}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                  Running...
                </>
              ) : (
                "Run Diagnostics Again"
              )}
            </button>

            <button
              onClick={fixDatabaseStructure}
              disabled={
                isLoading ||
                isFixing ||
                (diagnostics.tables.students.exists && diagnostics.tables.students.columns.length >= 10)
              }
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isFixing ? (
                <>
                  <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                  Fixing...
                </>
              ) : (
                "Fix Database Structure"
              )}
            </button>
          </div>

          {fixResult && (
            <div className={`p-4 border rounded-md ${fixResult.success ? "bg-green-50" : "bg-red-50"}`}>
              <h2 className="text-lg font-semibold mb-2">Fix Result</h2>
              <p className={fixResult.success ? "text-green-700" : "text-red-700"}>{fixResult.message}</p>
              {fixResult.error && <p className="text-red-700 mt-2">Error: {fixResult.error}</p>}
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">No diagnostic data available</div>
      )}
    </div>
  )
}

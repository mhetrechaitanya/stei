"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

export default function WorkshopDiagnostics() {
  const [diagnosticResults, setDiagnosticResults] = useState<{
    status: "loading" | "success" | "error"
    message: string
    details: any
  }>({
    status: "loading",
    message: "Running diagnostics...",
    details: null,
  })

  useEffect(() => {
    async function runDiagnostics() {
      try {
        // Step 1: Check if Supabase URL and key are available
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          setDiagnosticResults({
            status: "error",
            message: "Supabase configuration is missing",
            details: {
              hasUrl: !!supabaseUrl,
              hasKey: !!supabaseAnonKey,
            },
          })
          return
        }

        // Step 2: Try to initialize Supabase client
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // Step 3: Check if we can connect to Supabase
        const { data: connectionTest, error: connectionError } = await supabase
          .from("workshops")
          .select("count(*)")
          .limit(1)

        if (connectionError) {
          setDiagnosticResults({
            status: "error",
            message: "Failed to connect to database",
            details: {
              error: connectionError,
              errorCode: connectionError.code,
              errorMessage: connectionError.message,
            },
          })
          return
        }

        // Step 4: Check if workshops table exists and has data
        const { data: workshopsData, error: workshopsError } = await supabase.from("workshops").select("*").limit(10)

        if (workshopsError) {
          setDiagnosticResults({
            status: "error",
            message: "Error fetching workshops data",
            details: {
              error: workshopsError,
              errorCode: workshopsError.code,
              errorMessage: workshopsError.message,
            },
          })
          return
        }

        // Step 5: Check API endpoint
        const apiResponse = await fetch("/api/workshops", {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        const apiData = await apiResponse.json()

        // Step 6: Report results
        setDiagnosticResults({
          status: "success",
          message: "Diagnostics completed",
          details: {
            databaseConnection: "Success",
            workshopsTable: {
              exists: true,
              recordCount: workshopsData?.length || 0,
              sampleData: workshopsData?.slice(0, 3) || [],
            },
            apiEndpoint: {
              status: apiResponse.status,
              recordCount: Array.isArray(apiData) ? apiData.length : "Not an array",
              sampleData: Array.isArray(apiData) ? apiData.slice(0, 3) : apiData,
            },
          },
        })
      } catch (error) {
        setDiagnosticResults({
          status: "error",
          message: "Unexpected error during diagnostics",
          details: {
            error: error.message,
            stack: error.stack,
          },
        })
      }
    }

    runDiagnostics()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Workshop System Diagnostics</h2>

      <div
        className={`p-4 rounded-md mb-6 ${
          diagnosticResults.status === "loading"
            ? "bg-blue-50 text-blue-700"
            : diagnosticResults.status === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
        }`}
      >
        <p className="font-medium">{diagnosticResults.message}</p>
      </div>

      {diagnosticResults.status === "loading" ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D40F14]"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Diagnostic Details</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">
              {JSON.stringify(diagnosticResults.details, null, 2)}
            </pre>
          </div>

          {diagnosticResults.status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-red-700 mb-2">Recommended Actions</h3>
              <ul className="list-disc pl-5 text-red-700">
                {diagnosticResults.message.includes("configuration") && (
                  <li>
                    Check your environment variables for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
                  </li>
                )}
                {diagnosticResults.message.includes("connect") && (
                  <>
                    <li>Verify your Supabase project is active and running</li>
                    <li>Check if your IP address is allowed in Supabase</li>
                    <li>Verify your API keys are correct</li>
                  </>
                )}
                {diagnosticResults.message.includes("workshops data") && (
                  <>
                    <li>Check if the workshops table exists in your Supabase database</li>
                    <li>Verify the table structure matches the expected schema</li>
                    <li>Check if you have the necessary permissions to access the table</li>
                  </>
                )}
                <li>Try initializing the workshops table using the button below</li>
              </ul>
            </div>
          )}

          {diagnosticResults.status === "success" && diagnosticResults.details?.workshopsTable?.recordCount === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-yellow-700 mb-2">No Workshops Found</h3>
              <p className="text-yellow-700 mb-2">
                The workshops table exists but contains no records. You need to add workshops to display them on the
                website.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Run Diagnostics Again
            </button>

            <button
              onClick={async () => {
                try {
                  const response = await fetch("/api/workshops", {
                    method: "GET",
                    headers: {
                      "Cache-Control": "no-cache",
                      "x-initialize": "true",
                    },
                  })

                  if (response.ok) {
                    alert("Workshop initialization successful! Refreshing page...")
                    window.location.reload()
                  } else {
                    alert("Failed to initialize workshops. Check console for details.")
                    console.error("Initialization failed:", await response.json())
                  }
                } catch (error) {
                  alert("Error initializing workshops: " + error.message)
                  console.error("Initialization error:", error)
                }
              }}
              className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Initialize Workshops Table
            </button>

            <a
              href="/workshops"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              View Workshops Page
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

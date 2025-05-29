"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function InitializeStudentsTable() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const initializeTable = async () => {
    setStatus("loading")
    setMessage("Initializing students table...")

    try {
      const response = await fetch("/api/setup-students-table")
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message)
      } else {
        setStatus("error")
        setMessage(`Error: ${data.message}`)
        console.error("Setup error:", data.error)
      }
    } catch (error) {
      setStatus("error")
      setMessage(`Failed to initialize: ${error.message}`)
      console.error("Setup exception:", error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Students Table Setup</h2>

      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          Initialize the students table in your database to enable student registration and verification.
        </p>

        {status !== "idle" && (
          <div
            className={`p-3 rounded-md mt-3 ${
              status === "loading"
                ? "bg-blue-50 text-blue-700"
                : status === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
            }`}
          >
            <div className="flex items-start">
              {status === "loading" && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              {status === "success" && <CheckCircle className="h-5 w-5 mr-2" />}
              {status === "error" && <AlertCircle className="h-5 w-5 mr-2" />}
              <p>{message}</p>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={initializeTable}
        disabled={status === "loading"}
        className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Initializing...
          </>
        ) : (
          "Initialize Students Table"
        )}
      </Button>

      {status === "success" && (
        <p className="mt-4 text-sm text-green-600">
          Table setup complete! You can now use student verification features.
        </p>
      )}
    </div>
  )
}

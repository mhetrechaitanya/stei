"use client"

import { useState } from "react"
import { X, Mail, Phone, Loader2, AlertCircle, Database, Shield } from "lucide-react"

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerificationSuccess: (studentData: any) => void
}

export default function VerificationModal({ isOpen, onClose, onVerificationSuccess }: VerificationModalProps) {
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone">("phone")
  const [verificationValue, setVerificationValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [showDbFixOption, setShowDbFixOption] = useState(false)
  const [showPermissionFixOption, setShowPermissionFixOption] = useState(false)

  if (!isOpen) return null

  const handleVerify = async () => {
    // Reset states
    setError("")
    setDebugInfo(null)
    setShowDbFixOption(false)
    setShowPermissionFixOption(false)

    // Validate input
    if (!verificationValue) {
      setError(`Please enter your ${verificationMethod === "phone" ? "phone number" : "email address"}`)
      return
    }

    // Basic validation
    if (verificationMethod === "email" && !verificationValue.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    if (verificationMethod === "phone" && !/^\d{10}$/.test(verificationValue)) {
      setError("Please enter a valid 10-digit phone number")
      return
    }

    setIsLoading(true)

    try {
      console.log("Sending verification request:", {
        type: verificationMethod,
        value: verificationValue,
      })

      // Call API to verify student
      const response = await fetch("/api/verify-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: verificationMethod,
          value: verificationValue,
        }),
      })

      // Get response as text first for debugging
      const responseText = await response.clone().text()
      console.log("Raw API response:", responseText)

      // Try to parse as JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Failed to parse response as JSON:", e)
        setDebugInfo(`Invalid JSON response: ${responseText.substring(0, 100)}...`)
        throw new Error("Server returned invalid JSON")
      }

      // Handle response based on status
      if (!response.ok) {
        console.error("API error response:", data)
        setDebugInfo(`API error: ${data.message || response.status}`)

        // Check if it's a database structure error
        if (data.message && data.message.includes("Database structure")) {
          setShowDbFixOption(true)
        }

        // Check if it's a permission error
        if (
          data.message &&
          (data.message.includes("permission") ||
            data.message.includes("not allowed") ||
            data.message.includes("does not exist") ||
            data.message.includes("access"))
        ) {
          setShowPermissionFixOption(true)
        }

        throw new Error(data.message || `Server responded with status: ${response.status}`)
      }

      console.log("Verification response:", data)

      if (data.success && data.exists && data.student) {
        // Student exists, proceed to batch selection
        console.log("Verification successful, proceeding with student:", data.student)
        onVerificationSuccess(data.student)
      } else {
        // Student doesn't exist
        console.log("Student not found")
        setError("No student found with these details. Please register first.")
      }
    } catch (error) {
      console.error("Verification error:", error)
      setError(`Verification failed: ${error.message || "Please try again"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative animate-fadeIn">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isLoading}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Verify Your Details</h2>
          <p className="text-gray-600 mb-6">
            Please enter your registered email or phone number to continue with your booking.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 text-sm">{error}</p>

                  {showDbFixOption && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-yellow-800 text-sm font-medium mb-2">Database structure issue detected</p>
                      <a
                        href="/admin/fix-database"
                        className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors text-sm font-medium mr-2"
                      >
                        <Database className="h-4 w-4 mr-1.5" />
                        Fix Database Structure
                      </a>
                    </div>
                  )}

                  {showPermissionFixOption && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-blue-800 text-sm font-medium mb-2">Database permission issue detected</p>
                      <a
                        href="/admin/fix-permissions"
                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        <Shield className="h-4 w-4 mr-1.5" />
                        Fix Database Permissions
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {debugInfo && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-xs font-mono text-gray-700 break-all">{debugInfo}</p>
            </div>
          )}

          <div className="mb-6">
            <div className="flex border rounded-md overflow-hidden mb-4">
              <button
                type="button"
                onClick={() => {
                  setVerificationMethod("phone")
                  setVerificationValue("")
                  setError("")
                }}
                className={`flex-1 py-2 px-4 flex items-center justify-center ${
                  verificationMethod === "phone" ? "bg-[#FFF5F5] text-[#D40F14] font-medium" : "bg-white text-gray-600"
                }`}
              >
                <Phone className="h-4 w-4 mr-2" />
                Phone
              </button>
              <button
                type="button"
                onClick={() => {
                  setVerificationMethod("email")
                  setVerificationValue("")
                  setError("")
                }}
                className={`flex-1 py-2 px-4 flex items-center justify-center ${
                  verificationMethod === "email" ? "bg-[#FFF5F5] text-[#D40F14] font-medium" : "bg-white text-gray-600"
                }`}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor="verification-value" className="block text-sm font-medium text-gray-700 mb-1">
                {verificationMethod === "phone" ? "Phone Number" : "Email Address"}
              </label>
              <input
                type={verificationMethod === "phone" ? "tel" : "email"}
                id="verification-value"
                placeholder={verificationMethod === "phone" ? "Enter your phone number" : "Enter your email address"}
                value={verificationValue}
                onChange={(e) => setVerificationValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleVerify}
              disabled={isLoading || !verificationValue}
              className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-[#B00D11] transition-colors disabled:opacity-70 flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </button>
          </div>

          <div className="mt-4 text-center">
            <span className="text-gray-600">New student?</span>{" "}
            <a href="/student-registration" className="text-[#D40F14] hover:underline">
              Register here
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

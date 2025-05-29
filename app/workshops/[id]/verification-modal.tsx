"use client"

import type React from "react"

import { useState } from "react"
import { X, Mail, Phone, Loader2 } from "lucide-react"

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerificationSuccess: (studentId: string, studentData: any) => void
  onVerificationError?: (message: string) => void
  workshopId?: string
  batchId?: string
}

export default function VerificationModal({
  isOpen,
  onClose,
  onVerificationSuccess,
  onVerificationError,
  workshopId,
  batchId,
}: VerificationModalProps) {
  const [method, setMethod] = useState<"mobile" | "email">("mobile")
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate input
    if (!value) {
      const errorMsg = `Please enter your ${method === "mobile" ? "mobile number" : "email address"}`
      setError(errorMsg)
      if (onVerificationError) onVerificationError(errorMsg)
      return
    }

    if (method === "mobile" && !/^\d{10}$/.test(value)) {
      const errorMsg = "Please enter a valid 10-digit mobile number"
      setError(errorMsg)
      if (onVerificationError) onVerificationError(errorMsg)
      return
    }

    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      const errorMsg = "Please enter a valid email address"
      setError(errorMsg)
      if (onVerificationError) onVerificationError(errorMsg)
      return
    }

    setIsLoading(true)
    try {
      // Call API to verify student
      const response = await fetch("/api/verify-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: method === "mobile" ? "phone" : "email",
          value: value,
          workshopId,
          batchId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.student) {
        if (data.alreadyEnrolled) {
          const errorMsg = "You are already enrolled in this workshop batch."
          setError(errorMsg)
          if (onVerificationError) onVerificationError(errorMsg)
        } else {
          // Student exists, call the success handler
          onVerificationSuccess(data.student.id, data.student)
        }
      } else {
        // Student doesn't exist or error occurred
        const errorMsg = data.message || "No registration found with this information. Please register as a new user."
        setError(errorMsg)
        if (onVerificationError) onVerificationError(errorMsg)
      }
    } catch (error) {
      console.error("Verification error:", error)
      const errorMsg = "Verification failed. Please try again."
      setError(errorMsg)
      if (onVerificationError) onVerificationError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    try {
      if (!value || !value.trim()) {
        setError("Please enter a valid email or phone number")
        return
      }

      setIsLoading(true)
      setError("")

      // Call API to verify student
      const response = await fetch("/api/verify-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: method === "mobile" ? "phone" : "email",
          value: value,
          workshopId,
          batchId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.student) {
        if (data.alreadyEnrolled) {
          const errorMsg = "You are already enrolled in this workshop batch."
          setError(errorMsg)
          if (onVerificationError) onVerificationError(errorMsg)
        } else {
          // Student exists, call the success handler
          onVerificationSuccess(data.student.id, data.student)
        }
      } else {
        // Student doesn't exist or error occurred
        const errorMsg = data.message || "No registration found with this information. Please register as a new user."
        setError(errorMsg)
        if (onVerificationError) onVerificationError(errorMsg)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error during verification:", error)
      setIsLoading(false)
      setError("An unexpected error occurred. Please try again.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isLoading}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Verify Your Registration</h2>
          <p className="text-gray-600 mb-6">Please enter your registered mobile number or email address to continue.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex border rounded-md overflow-hidden">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 flex items-center justify-center ${
                    method === "mobile" ? "bg-[#D40F14] text-white" : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setMethod("mobile")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Mobile
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 flex items-center justify-center ${
                    method === "email" ? "bg-[#D40F14] text-white" : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setMethod("email")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="verification-input" className="block text-sm font-medium text-gray-700 mb-1">
                {method === "mobile" ? "Mobile Number" : "Email Address"}
              </label>
              <input
                id="verification-input"
                type={method === "mobile" ? "tel" : "email"}
                placeholder={method === "mobile" ? "Enter 10-digit mobile number" : "Enter your email address"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                disabled={isLoading}
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { X, Mail, Phone, Loader2, AlertCircle } from "lucide-react"

interface VerificationPopupProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (method: string, value: string) => Promise<any>
}

export default function VerificationPopup({ isOpen, onClose, onVerify }: VerificationPopupProps) {
  const [method, setMethod] = useState<"mobile" | "email">("mobile")
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate input
    if (!value) {
      setError(`Please enter your ${method === "mobile" ? "mobile number" : "email address"}`)
      return
    }

    if (method === "mobile" && !/^\d{10}$/.test(value)) {
      setError("Please enter a valid 10-digit mobile number")
      return
    }

    if (method === "email" && !value.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    try {
      // Try-catch to handle any errors from the onVerify function
      const result = await onVerify(method === "mobile" ? "phone" : "email", value)

      if (result === false) {
        console.log("Verification handled by parent component")
      }
    } catch (error) {
      console.error("Verification error:", error)
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isLoading}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">Verify Your Identity</h2>
          <p className="text-gray-600 mb-4">Please enter your registered mobile number or email address to continue.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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

            <div className="mb-4">
              <label htmlFor="verification-input" className="block text-sm font-medium text-gray-700 mb-1">
                {method === "mobile" ? "Mobile Number" : "Email Address"}
              </label>
              <input
                id="verification-input"
                type={method === "mobile" ? "tel" : "email"}
                placeholder={method === "mobile" ? "Enter 10-digit mobile number" : "Enter your email address"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                disabled={isLoading}
              />
              {error && (
                <div className="mt-2 flex items-start text-red-600">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
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

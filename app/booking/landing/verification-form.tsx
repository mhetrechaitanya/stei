"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Mail, Phone } from "lucide-react"

interface VerificationFormProps {
  onVerified: (type: string, value: string) => void
  onCancel: () => void
  workshopData: any
  isVerifying?: boolean
  verificationError?: string | null
}

export default function VerificationForm({
  onVerified,
  onCancel,
  workshopData,
  isVerifying = false,
  verificationError = null,
}: VerificationFormProps) {
  const [verificationType, setVerificationType] = useState<"email" | "phone">("email")
  const [verificationValue, setVerificationValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic validation
    if (!verificationValue.trim()) {
      setError(`Please enter your ${verificationType}`)
      return
    }

    if (verificationType === "email" && !verificationValue.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    if (verificationType === "phone" && !/^\d{10}$/.test(verificationValue.trim())) {
      setError("Please enter a valid 10-digit phone number")
      return
    }

    // Call the onVerified callback with the verification type and value
    onVerified(verificationType, verificationValue.trim())
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold">Verify Your Registration</h2>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Workshop: {workshopData.title}</h3>
        <p className="text-gray-600">{workshopData.description}</p>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 mb-4">Please enter your registered email or phone number to verify your account.</p>

        <div className="flex space-x-4 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              verificationType === "email" ? "bg-[#D40F14] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setVerificationType("email")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              verificationType === "phone" ? "bg-[#D40F14] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setVerificationType("phone")}
          >
            <Phone className="h-4 w-4 mr-2" />
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="verification-value" className="block text-sm font-medium text-gray-700 mb-1">
              {verificationType === "email" ? "Email Address" : "Phone Number"}
            </label>
            <input
              type={verificationType === "email" ? "email" : "tel"}
              id="verification-value"
              placeholder={verificationType === "email" ? "your.email@example.com" : "10-digit mobile number"}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
              value={verificationValue}
              onChange={(e) => setVerificationValue(e.target.value)}
              required
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {verificationError && <p className="mt-1 text-sm text-red-600">{verificationError}</p>}
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11] transition-colors"
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

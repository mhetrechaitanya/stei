"use client"

import { useState } from "react"
import { Loader2, AlertCircle } from "lucide-react"

interface MobileVerificationProps {
  onVerified: (studentData: any) => void
  onCancel: () => void
  workshopId: string
}

export default function MobileVerification({ onVerified, onCancel, workshopId }: MobileVerificationProps) {
  const [mobileNumber, setMobileNumber] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      // Call API to verify mobile number
      const response = await fetch("/api/verify-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "phone",
          value: mobileNumber,
          workshopId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Server responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Format student data
        const student = data.student || {}
        const studentData = {
          id: student.id || "",
          name: student.name || `${student.first_name || ""} ${student.last_name || ""}`.trim() || "Student",
          email: student.email || "",
          phone: mobileNumber,
          ...student,
        }

        // Check if already enrolled
        if (data.alreadyEnrolled) {
          setError("You are already enrolled in this workshop batch.")
          setIsVerifying(false)
          return
        }

        // Call the onVerified callback with student data
        onVerified(studentData)
      } else {
        setError(data.message || "Verification failed. Please check your mobile number.")
      }
    } catch (error) {
      console.error("Error verifying mobile number:", error)
      setError("An error occurred during verification. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Verify Your Mobile Number</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter your 10-digit mobile number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />
          <p className="mt-1 text-sm text-gray-500">Enter the mobile number you used during registration</p>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isVerifying || mobileNumber.length !== 10}
            className="px-4 py-2 bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <>
                <Loader2 className="animate-spin inline mr-2 h-4 w-4" />
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          New student?{" "}
          <a href="/register" className="text-[#D40F14] hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  )
}

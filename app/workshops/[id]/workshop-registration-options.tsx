"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import VerificationModal from "./verification-modal"

export default function WorkshopRegistrationOptions({ workshopId }) {
  const router = useRouter()
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const [verificationError, setVerificationError] = useState("")

  const handleAlreadyRegistered = () => {
    setVerificationError("")
    setIsVerificationModalOpen(true)
  }

  const handleVerificationSuccess = (studentId, studentData) => {
    try {
      // Redirect to batch selection with student data
      const encodedData = encodeURIComponent(JSON.stringify(studentData))
      router.push(`/workshops/${workshopId}/select-batch?studentId=${studentId}&studentData=${encodedData}`)
    } catch (error) {
      console.error("Navigation error:", error)
      setVerificationError("Failed to proceed to the next step. Please try again.")
    }
  }

  const handleVerificationError = (message) => {
    setVerificationError(message)
  }

  return (
    <div className="space-y-4">
      <Link
        href={`/student-registration?redirectTo=/workshops/${workshopId}`}
        className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
      >
        New Registration
      </Link>

      <button
        onClick={handleAlreadyRegistered}
        className="w-full bg-white border-2 border-[#D40F14] text-[#D40F14] hover:bg-[#FFF5F5] font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
      >
        Already Registered
      </button>

      {/* Book Slot button hidden as requested */}
      {/* 
      <Link
        href={`/workshops/${workshopId}/select-batch`}
        className="bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-3 px-6 rounded-full transition-all duration-300 flex items-center"
      >
        <Calendar className="mr-2 h-5 w-5" />
        Book Slot
      </Link>
      */}

      {verificationError && <div className="text-red-600 text-sm mt-2 text-center">{verificationError}</div>}

      {isVerificationModalOpen && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          onVerificationSuccess={handleVerificationSuccess}
          onVerificationError={handleVerificationError}
          workshopId={workshopId}
        />
      )}
    </div>
  )
}

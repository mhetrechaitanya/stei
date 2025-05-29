"use client"
import { User } from "lucide-react"
import { useState } from "react"
import VerificationPopup from "./verification-popup"
import BatchSelectionPopup from "./batch-selection-popup"
import PaymentSummary from "./payment-summary"
import { useRouter } from "next/navigation"

interface AlreadyRegisteredCardProps {
  onContinueToPayment?: () => void
}

export default function AlreadyRegisteredCard({ onContinueToPayment }: AlreadyRegisteredCardProps) {
  const [isVerificationOpen, setIsVerificationOpen] = useState(false)
  const [verificationError, setVerificationError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [studentData, setStudentData] = useState(null)
  const [workshopData, setWorkshopData] = useState(null)
  const [showBatchSelector, setShowBatchSelector] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [showPaymentSummary, setShowPaymentSummary] = useState(false)
  const router = useRouter()

  // Handle verification button click
  const handleContinueClick = () => {
    setIsVerificationOpen(true)
    setVerificationError("")
  }

  // Handle verification success
  const handleVerificationSuccess = async (studentId, studentData) => {
    setStudentData(studentData)

    try {
      // Fetch workshop data (for demo, we'll fetch the first workshop)
      const response = await fetch("/api/workshops")
      if (response.ok) {
        const data = await response.json()
        if (data.workshops && data.workshops.length > 0) {
          setWorkshopData(data.workshops[0])
          setIsVerificationOpen(false)
          setShowBatchSelector(true)
        }
      }
    } catch (error) {
      console.error("Error fetching workshop data:", error)
      // Fallback to redirect if API fails
      router.push(`/booking/registered?studentId=${studentId}`)
    }
  }

  // Handle batch selection
  const handleBatchSelected = (batch) => {
    setSelectedBatch(batch)
  }

  // Handle continue to payment
  const handleContinueToPayment = () => {
    setShowBatchSelector(false)
    setShowPaymentSummary(true)
  }

  // Handle payment success
  const handlePaymentSuccess = async (transactionId, paymentDetails) => {
    try {
      // Create enrollment record
      const enrollmentResponse = await fetch("/api/enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentData.id,
          workshopId: workshopData.id,
          batchId: selectedBatch.id,
          transactionId,
          amount: workshopData.price || 4999,
          paymentStatus: "SUCCESS",
          paymentMethod: paymentDetails.paymentMethod || "online",
          orderId: paymentDetails.orderId,
        }),
      })

      if (!enrollmentResponse.ok) {
        throw new Error("Failed to create enrollment record")
      }

      // Redirect to confirmation page
      router.push(`/booking/confirmation?orderId=${paymentDetails.orderId}&transactionId=${transactionId}`)
    } catch (error) {
      console.error("Error creating enrollment:", error)
    }
  }

  return (
    <div className="bg-red-50 rounded-lg p-6 text-center flex flex-col items-center">
      <div className="bg-[#D40F14] rounded-full p-4 mb-4">
        <User className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold mb-2">Already Registered</h3>
      <p className="text-gray-600 mb-6">
        If you've already registered with us, use this option to book a workshop slot
      </p>
      <button
        onClick={handleContinueClick}
        className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
        data-action="existing-user"
      >
        Continue as Registered Student
      </button>

      {verificationError && <div className="mt-4 text-red-600 text-sm">{verificationError}</div>}

      {/* Verification Popup */}
      <VerificationPopup
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onVerify={async (method, value) => {
          try {
            setIsLoading(true)
            setVerificationError("")

            // Call API to verify student
            const response = await fetch("/api/verify-student", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: method,
                value: value,
              }),
            })

            if (!response.ok) {
              console.error(`Server responded with status: ${response.status}`)
              setVerificationError("Server error. Please try again.")
              return false
            }

            const data = await response.json()
            console.log("Verification response:", data)

            if (data.success && data.exists && data.student) {
              // Student exists, show batch selector
              handleVerificationSuccess(data.student.id, data.student)
              return true
            } else {
              // Student doesn't exist
              setVerificationError("No student found with these details. Please register first.")
              return false
            }
          } catch (error) {
            console.error("Verification error:", error)
            setVerificationError("Verification failed. Please try again.")
            return false
          } finally {
            setIsLoading(false)
          }
        }}
      />

      {/* Batch Selector */}
      {showBatchSelector && workshopData && (
        <BatchSelectionPopup
          workshop={workshopData}
          onBatchSelected={handleBatchSelected}
          onContinue={handleContinueToPayment}
          onClose={() => setShowBatchSelector(false)}
        />
      )}

      {/* Payment Summary */}
      {showPaymentSummary && workshopData && selectedBatch && studentData && (
        <PaymentSummary
          studentData={studentData}
          workshopData={workshopData}
          selectedBatch={selectedBatch}
          onCancel={() => {
            setShowPaymentSummary(false)
            setShowBatchSelector(true)
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import VerificationModal from "./verification-modal"
import PaymentDetails from "./payment-details"
import { useRouter } from "next/navigation"
import CalendarBatchSelector from "@/app/components/calendar-batch-selector"

interface BookingLandingClientProps {
  workshopId: string;
  batchId: string;
}

export default function BookingLandingClient({ workshopId, batchId }: BookingLandingClientProps) {
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false)
  const [isBatchSelectorOpen, setIsBatchSelectorOpen] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [studentData, setStudentData] = useState(null)
  const [workshopData, setWorkshopData] = useState(null)
  const [orderId, setOrderId] = useState("")
  const router = useRouter()
  const [selectedBatch, setSelectedBatch] = useState<{ id: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch workshop data
  useEffect(() => {
    const fetchWorkshopData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/workshops/${workshopId}`)
        
        if (response.ok) {
          const data = await response.json()

          console.log("booking landing client : ", data)

          // Ensure we have a properly structured workshop object
          setWorkshopData({
            id: data.id || workshopId,
            title: data.title || "Workshop",
            price: data.fee || 0,
            sessions: data.sessions || 4,
            duration: data.duration || "2 hours",
            image: data.image || null,
            batches: data.batches || [],
            selectedBatchId: batchId,
            ...data// Include all other properties
          })
          console.log("Workshop data fetched:", workshopData)
        } else {
          console.error("Failed to fetch workshop data:", response.statusText)
        }
      } catch (error) {
        console.error("Error fetching workshop data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (workshopId) {
      fetchWorkshopData()
    }
  }, [workshopId, batchId])

  // Handle continue to payment button click
  useEffect(() => {
    const continueBtn = document.getElementById("continue-to-payment-btn")
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        setIsVerificationModalOpen(true)
      })
    }

    return () => {
      if (continueBtn) {
        continueBtn.removeEventListener("click", () => {
          setIsVerificationModalOpen(true)
        })
      }
    }
  }, [])

  const handleVerified = async (type: string, value: string) => {
    setIsVerifying(true)
    setVerificationError(null)

    try {
      console.log("Verifying with", type, value)

      // Call API to verify student
      const response = await fetch("/api/verify-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          value,
          workshopId,
          batchId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`)
      }

      const verifyData = await response.json()
      console.log("Verification response:", verifyData)

      if (verifyData.success) {
        // Ensure we have a properly structured student object
        const student = verifyData.student || {}
        setStudentData({
          id: student.id || "",
          name: student.name || `${student.first_name || ""} ${student.last_name || ""}`.trim() || "Student",
          email: student.email || value,
          phone: student.phone || value,
          ...student, // Include all other properties
        })

        // Check if already enrolled
        if (verifyData.alreadyEnrolled) {
          setVerificationError("You are already enrolled in this workshop batch.")
          return
        }

        // Generate order ID
        const newOrderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        setOrderId(newOrderId)

        // Close verification modal
        setIsVerificationModalOpen(false)

        // Show batch selection calendar
        setTimeout(() => {
          setIsBatchSelectorOpen(true)
        }, 300)
      } else {
        setVerificationError(verifyData.message || "Verification failed. Please check your details.")
      }
    } catch (error) {
      console.error("Error during verification:", error)
      setVerificationError("An error occurred during verification. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleBatchSelected = (batch: any) => {
    console.log("Batch selected:", batch)
    setSelectedBatch(batch)
  }

  const handleBatchSelectionComplete = (batch : any) => {
    console.log("Batch selection completed with:", batch)
    // Close batch selector and open payment details
    setIsBatchSelectorOpen(false)

    // Make sure we have the latest selected batch
    setSelectedBatch(batch)

    // Add a small delay before showing payment details
    setTimeout(() => {
      setIsPaymentDetailsOpen(true)
    }, 300)
  }

  const handlePaymentProceed = (studentId: string, workshopId: string, batchId: string) => {
    // Use the selected batch ID if available
    const finalBatchId = selectedBatch?.id || batchId

    console.log("Proceeding to payment with:", {
      studentId,
      workshopId,
      batchId: finalBatchId,
      orderId,
    })

    // Handle payment process
    router.push(
      `/booking/payment?studentId=${studentId}&workshopId=${workshopId}&batchId=${finalBatchId}&orderId=${orderId}`,
    )
  }



  console.log("data in BookingLandingClient : ", workshopData);

  return (
    <>
      {isVerificationModalOpen && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          onVerified={handleVerified}
          workshopData={workshopData}
          verificationError={verificationError}
          isVerifying={isVerifying}
        />
      )}

      {isBatchSelectorOpen && workshopData && (
        <CalendarBatchSelector
          isOpen={isBatchSelectorOpen}
          onClose={() => setIsBatchSelectorOpen(false)}
          workshop={workshopData}
          onBatchSelected={handleBatchSelected}
          onContinue={handleBatchSelectionComplete}
        />
      )}

      {isPaymentDetailsOpen && studentData && workshopData && selectedBatch && (
        <PaymentDetails
          studentData={studentData}
          workshopData={workshopData}
          selectedBatch={selectedBatch}
          onCancel={() => setIsPaymentDetailsOpen(false)}
          onProceed={handlePaymentProceed}
          orderId={orderId}
        />
      )}
    </>
  )
}

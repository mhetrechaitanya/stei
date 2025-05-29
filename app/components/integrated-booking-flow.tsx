"use client"

import { useState } from "react"
import MobileVerification from "./mobile-verification"
import SimplifiedBatchSelector from "./simplified-batch-selector"
import DirectPaymentHandler from "./direct-payment-handler"

interface IntegratedBookingFlowProps {
  workshop: any
  onPaymentSuccess: (transactionId: string, paymentDetails: any) => void
}

export default function IntegratedBookingFlow({ workshop, onPaymentSuccess }: IntegratedBookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<"verification" | "batch-selection" | "payment">("verification")
  const [studentData, setStudentData] = useState(null)
  const [selectedBatch, setSelectedBatch] = useState(null)

  if (!workshop) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-center">
        <p className="text-red-700">Workshop information is unavailable. Please try again later.</p>
      </div>
    )
  }

  const handleVerified = (verifiedStudentData) => {
    setStudentData(verifiedStudentData)
    setCurrentStep("batch-selection")
  }

  const handleBatchSelected = (batch) => {
    setSelectedBatch(batch)
  }

  const handleContinueToPayment = () => {
    setCurrentStep("payment")
  }

  const handlePaymentSuccess = (transactionId, paymentDetails) => {
    onPaymentSuccess(transactionId, {
      ...paymentDetails,
      studentData,
      selectedBatch,
    })
  }

  const handleCancel = () => {
    // Reset to first step
    setCurrentStep("verification")
    setStudentData(null)
    setSelectedBatch(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {currentStep === "verification" && (
        <MobileVerification onVerified={handleVerified} onCancel={handleCancel} workshopId={workshop.id} />
      )}

      {currentStep === "batch-selection" && studentData && (
        <SimplifiedBatchSelector
          workshop={workshop}
          onBatchSelected={handleBatchSelected}
          onContinueToPayment={handleContinueToPayment}
        />
      )}

      {currentStep === "payment" && studentData && selectedBatch && (
        <DirectPaymentHandler
          isOpen={true}
          onClose={handleCancel}
          studentData={studentData}
          workshopData={workshop}
          selectedBatch={selectedBatch}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

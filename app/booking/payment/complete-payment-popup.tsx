"use client"

import { X } from "lucide-react"
import { useState } from "react"

interface CompletePaymentPopupProps {
  orderId: string
  studentName: string
  amount: number
  onClose: () => void
  onPaymentComplete: (transactionId: string) => void
}

export default function CompletePaymentPopup({
  orderId,
  studentName,
  amount,
  onClose,
  onPaymentComplete,
}: CompletePaymentPopupProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a transaction ID
      const transactionId = `TXN_${Date.now()}`

      // Call the callback with the transaction ID
      onPaymentComplete(transactionId)
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm max-h-[80vh] relative animate-fadeIn my-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-3rem)]">
          <h2 className="text-xl font-bold mb-4 text-center">Complete Payment</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{orderId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Student:</span>
              <span className="font-medium">{studentName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">₹{amount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-70 flex items-center justify-center"
          >
            {isProcessing ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
          </button>

          <div className="mt-4 text-center text-sm text-gray-500">Secure payment powered by Cashfree</div>
        </div>
      </div>
    </div>
  )
}

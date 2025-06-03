"use client"

import { useState } from "react"
import { X, Calendar, Clock, CreditCard } from "lucide-react"
import PaymentGateway from "@/app/components/payment-gateway"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  studentName: string
  email: string
  phone: string
  workshopTitle: string
  batchDate: string
  batchTime: string
  onPaymentSuccess: (transactionId: string, paymentDetails: any) => void
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  studentName,
  email,
  phone,
  workshopTitle,
  batchDate,
  batchTime,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [orderId] = useState(`STEI-${Date.now()}-${Math.floor(Math.random() * 1000)}`)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePaymentSuccess = (transactionId: string, paymentDetails: any) => {
    try {
      onPaymentSuccess(transactionId, {
        ...paymentDetails,
        orderId,
        amount,
        studentName,
        email,
        phone,
        workshopTitle,
        batchDate,
        batchTime,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Payment success handler error:", error)
      setError("There was an error processing your payment. Please contact support.")
    }
  }

  const handlePayment = async () => {
    try {
      setIsProcessing(true)

      // Your existing payment processing code...

      setIsProcessing(false)
    } catch (error) {
      console.error("Error processing payment:", error)
      setIsProcessing(false)
      setError("An unexpected error occurred while processing your payment. Please try again.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
          disabled={isLoading}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Complete Your Payment</h2>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-2">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Workshop:</span>
                <span className="font-medium">{workshopTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Batch Date:</span>
                <span className="font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-[#D40F14]" />
                  {batchDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Batch Time:</span>
                <span className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-[#D40F14]" />
                  {batchTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Student:</span>
                <span className="font-medium">{studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-sm">{orderId}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="font-bold">Total Amount:</span>
                <span className="font-bold text-[#D40F14]">₹{amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-4"></h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50 hover:border-[#D40F14] transition-colors"
                onClick={() => setSelectedPaymentMethod("card")}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${selectedPaymentMethod === "card" ? "bg-[#D40F14] text-white" : "bg-gray-100"}`}
                >
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className="font-medium">Credit/Debit Card</span>
              </div>

              <div
                className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50 hover:border-[#D40F14] transition-colors"
                onClick={() => setSelectedPaymentMethod("upi")}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${selectedPaymentMethod === "upi" ? "bg-[#D40F14] text-white" : "bg-gray-100"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L4 8v8l8 8 8-8V8L12 0zm0 6l4 4-4 4-4-4 4-4z" />
                  </svg>
                </div>
                <span className="font-medium">UPI / GPay</span>
              </div>
            </div>

            {selectedPaymentMethod === "card" && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    maxLength={16}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedPaymentMethod === "upi" && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter your UPI ID (e.g., name@okaxis, name@ybl)</p>
                </div>
              </div>
            )}
          </div>

          <PaymentGateway
            amount={amount}
            studentName={studentName}
            email={email}
            phone={phone}
            orderId={orderId}
            onSuccess={handlePaymentSuccess}
            onCancel={onClose}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        </div>
      </div>
    </div>
  )
}

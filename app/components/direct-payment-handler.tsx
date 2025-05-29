"use client"

import { useState } from "react"
import { CreditCard, Calendar, Clock, X, Loader2, ShieldAlert } from "lucide-react"

interface DirectPaymentHandlerProps {
  isOpen: boolean
  onClose: () => void
  studentData: any
  workshopData: any
  selectedBatch: any
  onPaymentSuccess: (transactionId: string, paymentDetails: any) => void
}

export default function DirectPaymentHandler({
  isOpen,
  onClose,
  studentData,
  workshopData,
  selectedBatch,
  onPaymentSuccess,
}: DirectPaymentHandlerProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [orderId] = useState(`STEI-${Date.now()}-${Math.floor(Math.random() * 1000)}`)

  if (!isOpen) return null

  const handlePaymentSubmit = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate mock transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`

      // Call the success handler
      onPaymentSuccess(transactionId, {
        orderId,
        amount: workshopData.price,
        paymentMethod: selectedPaymentMethod,
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Payment error:", error)
      setError("There was an error processing your payment. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
          disabled={isLoading}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-2">
          <h2 className="text-sm font-bold mb-1">Complete Your Payment</h2>

          {error && (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-xs">{error}</p>
            </div>
          )}

          <div className="bg-gray-50 p-1.5 rounded-lg mb-1.5 text-[10px]">
            <h3 className="font-medium mb-0.5 text-[11px]">Order Summary</h3>
            <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
              <span className="text-gray-600">Workshop:</span>
              <span className="font-medium text-right">{workshopData?.title || "Workshop"}</span>

              <span className="text-gray-600">Batch Date:</span>
              <span className="font-medium text-right flex items-center justify-end">
                <Calendar className="h-3 w-3 mr-0.5 text-[#D40F14]" />
                {selectedBatch?.date || "Not specified"}
              </span>

              <span className="text-gray-600">Batch Time:</span>
              <span className="font-medium text-right flex items-center justify-end">
                <Clock className="h-3 w-3 mr-0.5 text-[#D40F14]" />
                {selectedBatch?.time || "Not specified"}
              </span>

              <span className="text-gray-600">Student:</span>
              <span className="font-medium text-right">{studentData?.name || "Student"}</span>

              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium text-right text-[10px]">{orderId}</span>

              <span className="font-bold col-span-1 border-t pt-0.5 mt-0.5">Total Amount:</span>
              <span className="font-bold text-[#D40F14] text-right border-t pt-0.5 mt-0.5">
                ₹{(workshopData?.price || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mb-1.5">
            <h3 className="font-medium mb-0.5 text-[11px]">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-1.5 mb-1.5">
              <div
                className={`border rounded-lg p-1.5 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedPaymentMethod === "card" ? "border-[#D40F14] bg-[#FFF5F5]" : "border-gray-200"
                }`}
                onClick={() => setSelectedPaymentMethod("card")}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mb-0.5 ${
                    selectedPaymentMethod === "card" ? "bg-[#D40F14] text-white" : "bg-gray-100"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="font-medium text-sm">Credit/Debit Card</span>
              </div>

              <div
                className={`border rounded-lg p-1.5 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedPaymentMethod === "upi" ? "border-[#D40F14] bg-[#FFF5F5]" : "border-gray-200"
                }`}
                onClick={() => setSelectedPaymentMethod("upi")}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mb-0.5 ${
                    selectedPaymentMethod === "upi" ? "bg-[#D40F14] text-white" : "bg-gray-100"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L4 8v8l8 8 8-8V8L12 0zm0 6l4 4-4 4-4-4 4-4z" />
                  </svg>
                </div>
                <span className="font-medium text-sm">UPI / GPay</span>
              </div>
            </div>

            {selectedPaymentMethod === "card" && (
              <div className="space-y-1 p-2 border rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                    maxLength={16}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedPaymentMethod === "upi" && (
              <div className="space-y-1 p-2 border rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                  />
                  <p className="mt-0.5 text-xs text-gray-500">Enter your UPI ID (e.g., name@okaxis, name@ybl)</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#FFF5F5] p-1 rounded-lg mb-1.5 text-[10px]">
            <div className="flex items-center">
              <ShieldAlert className="h-3 w-3 text-[#D40F14] mr-1" />
              <h4 className="font-medium text-xs">Secure Payment</h4>
            </div>
            <p className="text-xs text-gray-600">Your payment information is encrypted and securely processed.</p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handlePaymentSubmit}
              disabled={isLoading}
              className="px-3 py-1 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11] transition-colors disabled:opacity-70 text-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin inline mr-1 h-3 w-3" />
                  Processing...
                </>
              ) : (
                `Pay ₹${(workshopData?.price || 0).toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

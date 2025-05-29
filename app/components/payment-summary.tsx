"use client"

import { useState } from "react"
import { CheckCircle, X, Loader2, CreditCard, Smartphone, QrCode } from "lucide-react"
import Image from "next/image"

interface PaymentSummaryProps {
  studentData: any
  workshopData: any
  selectedBatch: any
  onCancel: () => void
  onPaymentSuccess: (transactionId: string, paymentDetails: any) => void
  orderId?: string
}

export default function PaymentSummary({
  studentData,
  workshopData,
  selectedBatch,
  onCancel,
  onPaymentSuccess,
  orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
}: PaymentSummaryProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)

  // Format the workshop title to match the design
  const formatTitle = (title: string | undefined) => {
    if (!title) return "Workshop" // Return a default value if title is undefined

    if (title.toLowerCase().includes("iace")) {
      return (
        <>
          i<span className="text-[#D40F14]">ACE</span> {title.replace(/iace/i, "").trim()}
        </>
      )
    }
    return title
  }

  // Format student name
  const getStudentName = () => {
    if (studentData.name) return studentData.name
    if (studentData.first_name && studentData.last_name) return `${studentData.first_name} ${studentData.last_name}`
    return "Student"
  }

  const handleProceedToPayment = () => {
    setShowPaymentMethods(true)
  }

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method)
  }

  const handleProcessPayment = async () => {
    if (!selectedPaymentMethod) {
      setError("Please select a payment method")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Check if we should use real payment API
      const useRealPayment = process.env.NEXT_PUBLIC_USE_REAL_PAYMENT_API === "true"

      if (useRealPayment) {
        // Create payment order with Cashfree
        const response = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            amount: workshopData.price || 4999,
            studentName: getStudentName(),
            email: studentData.email,
            phone: studentData.phone,
            paymentMethod: selectedPaymentMethod,
          }),
        })

        if (!response.ok) {
          throw new Error(`Payment request failed: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success) {
          // Redirect to Cashfree payment page
          window.location.href = data.paymentLink
          return
        } else {
          throw new Error(data.message || "Payment initialization failed")
        }
      } else {
        // Use mock payment for testing
        console.log("Using mock payment")

        // Simulate successful payment after a delay
        setTimeout(() => {
          const transactionId = `MOCK_${Date.now()}`
          const paymentDetails = {
            orderId,
            amount: workshopData.price || 4999,
            paymentMethod: selectedPaymentMethod,
            status: "SUCCESS",
            timestamp: new Date().toISOString(),
          }

          onPaymentSuccess(transactionId, paymentDetails)
        }, 2000)
      }
    } catch (error) {
      console.error("Payment error:", error)
      setError(error.message || "An error occurred during payment processing")
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md max-h-[90vh] relative animate-fadeIn my-8">
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-4rem)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Payment Summary</h2>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          {!showPaymentMethods ? (
            <>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 relative rounded-md overflow-hidden mr-3">
                  <Image
                    src={workshopData.image || "/placeholder.svg?height=64&width=64"}
                    alt={workshopData.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base">{formatTitle(workshopData.title)}</h3>
                  <p className="text-sm text-gray-600">
                    {workshopData.sessions} Sessions • {workshopData.duration?.split(" ")[0] || "2"} hours per session
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2">Student Information</h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <p className="mb-1">
                    <span className="font-medium">Name:</span>
                  </p>
                  <p className="mb-1 text-right">{getStudentName()}</p>
                  <p className="mb-1">
                    <span className="font-medium">Email:</span>
                  </p>
                  <p className="mb-1 text-right">{studentData.email}</p>
                  <p>
                    <span className="font-medium">Phone:</span>
                  </p>
                  <p className="text-right">{studentData.phone}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Batch Information</h4>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <p className="mb-1">
                      <span className="font-medium">Date:</span>
                    </p>
                    <p className="mb-1 text-right">{selectedBatch?.date || "Not specified"}</p>
                    <p className="mb-1">
                      <span className="font-medium">Time:</span>
                    </p>
                    <p className="mb-1 text-right">{selectedBatch?.time || "Not specified"}</p>
                    <p>
                      <span className="font-medium">Slots Available:</span>
                    </p>
                    <p className="text-right">{selectedBatch ? selectedBatch.slots - selectedBatch.enrolled : "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2 py-1">
                  <span>Workshop Fee</span>
                  <span className="font-bold">₹{workshopData.price || 4999}</span>
                </div>
                <div className="flex justify-between mb-2 py-1 text-green-600">
                  <span>Discount</span>
                  <span>₹0</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg py-1">
                  <span>Total Amount</span>
                  <span>₹{workshopData.price || 4999}</span>
                </div>
              </div>

              <div className="bg-[#FFF5F5] p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-3">Order Information</h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <p className="mb-1">
                    <span className="font-medium">Order ID:</span>
                  </p>
                  <p className="mb-1 text-right">{orderId}</p>
                  <p className="mb-1">
                    <span className="font-medium">Date:</span>
                  </p>
                  <p className="mb-1 text-right">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="bg-[#FFF5F5] p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-3">Payment Information</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                    <span>Secure payment gateway with end-to-end encryption</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                    <span>Multiple payment options available (Cards, UPI, Net Banking)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                    <span>You'll receive a confirmation email after successful payment</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-3 px-4 rounded-md transition-colors duration-300"
                >
                  Proceed to Payment
                </button>

                <div className="mt-3 text-center text-xs text-gray-500">Secure payment powered by Cashfree</div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-3">Select Payment Method</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose your preferred payment method to complete the transaction.
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === "card"
                        ? "border-[#D40F14] bg-[#FFF5F5]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePaymentMethodSelect("card")}
                  >
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-[#D40F14] mr-3" />
                      <div>
                        <p className="font-medium">Credit / Debit Card</p>
                        <p className="text-xs text-gray-500">Visa, Mastercard, RuPay, and more</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === "upi"
                        ? "border-[#D40F14] bg-[#FFF5F5]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePaymentMethodSelect("upi")}
                  >
                    <div className="flex items-center">
                      <Smartphone className="h-5 w-5 text-[#D40F14] mr-3" />
                      <div>
                        <p className="font-medium">UPI / Google Pay</p>
                        <p className="text-xs text-gray-500">Pay using any UPI app</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === "qr"
                        ? "border-[#D40F14] bg-[#FFF5F5]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePaymentMethodSelect("qr")}
                  >
                    <div className="flex items-center">
                      <QrCode className="h-5 w-5 text-[#D40F14] mr-3" />
                      <div>
                        <p className="font-medium">QR Code Payment</p>
                        <p className="text-xs text-gray-500">Scan and pay using any payment app</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleProcessPayment}
                  disabled={isLoading || !selectedPaymentMethod}
                  className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5 inline" />
                      Processing Payment...
                    </>
                  ) : (
                    "Pay ₹" + (workshopData.price || 4999)
                  )}
                </button>

                <button
                  onClick={() => setShowPaymentMethods(false)}
                  disabled={isLoading}
                  className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Back to Summary
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

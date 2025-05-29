"use client"

import { useState } from "react"
import { X, CreditCard, Loader2 } from "lucide-react"

interface PaymentPopupProps {
  amount: number
  studentName: string
  email: string
  phone: string
  orderId: string
  onSuccess: (transactionId: string, paymentDetails: any) => void
  onCancel: () => void
}

export default function PaymentPopup({
  amount,
  studentName,
  email,
  phone,
  orderId,
  onSuccess,
  onCancel,
}: PaymentPopupProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePayment = async () => {
    setLoading(true)
    setError("")

    try {
      console.log("Creating payment order for:", { orderId, amount, studentName, email, phone })

      // Check if we're in development mode and not using real payment API
      const useRealPaymentAPI = process.env.NEXT_PUBLIC_USE_REAL_PAYMENT_API === "true"

      if (!useRealPaymentAPI && process.env.NODE_ENV === "development") {
        console.log("Using simulated payment in development mode")
        // Simulate a successful payment after a delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const mockTransactionId = `TXN_${Date.now()}`
        const mockPaymentDetails = {
          orderId,
          amount,
          paymentMethod: "card",
          cardNetwork: "Visa",
          cardLast4: "1234",
          status: "SUCCESS",
        }

        onSuccess(mockTransactionId, mockPaymentDetails)
        return
      }

      // Create order in Cashfree
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount,
          name: studentName,
          email,
          phone,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Order creation failed:", errorData)
        throw new Error(errorData.message || `Server returned ${response.status}: ${response.statusText}`)
      }

      const orderData = await response.json()
      console.log("Order created:", orderData)

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create payment order")
      }

      // For real implementation with Cashfree
      if (useRealPaymentAPI) {
        // If we have an order token, we can use the Cashfree SDK or redirect to payment page
        if (orderData.orderToken) {
          // Check if Cashfree SDK is available
          if (window.Cashfree) {
            const cashfree = new window.Cashfree()
            const checkoutOptions = {
              orderToken: orderData.orderToken,
              onSuccess: (data) => {
                console.log("Payment success:", data)
                onSuccess(data.transaction?.transactionId || `TXN${Date.now()}`, data)
              },
              onFailure: (data) => {
                console.error("Payment failure:", data)
                setError(data.message || "Payment failed. Please try again.")
                setLoading(false)
              },
              onClose: () => {
                console.log("Payment window closed")
                setLoading(false)
              },
            }
            cashfree.checkout(checkoutOptions)
          } else {
            // Redirect to Cashfree payment page
            const cashfreePaymentUrl =
              process.env.NODE_ENV === "production"
                ? `https://payments.cashfree.com/order/#${orderData.orderToken}`
                : `https://payments-test.cashfree.com/order/#${orderData.orderToken}`

            window.location.href = cashfreePaymentUrl
          }
        } else {
          throw new Error("No order token received from server")
        }
      } else {
        // Simulate payment success for development
        setTimeout(() => {
          const mockTransactionId = `TXN_${Date.now()}`
          const mockPaymentDetails = {
            orderId,
            amount,
            paymentMethod: "card",
            cardNetwork: "Visa",
            cardLast4: "1234",
            status: "SUCCESS",
          }

          onSuccess(mockTransactionId, mockPaymentDetails)
        }, 2000)
      }
    } catch (error) {
      console.error("Payment error:", error)
      setError(error.message || "An error occurred during payment processing")
      setLoading(false)
    }
  }

  // Format the amount to ensure it has exactly 2 decimal places
  const formattedAmount = amount.toFixed(2)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md max-h-[70vh] relative animate-fadeIn my-2">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={loading}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-3 overflow-y-auto max-h-[calc(70vh-3rem)]">
          <h2 className="text-lg font-bold mb-2">Complete Payment</h2>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Student:</span>
              <span className="font-medium">{studentName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">₹{formattedAmount}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded-md mb-3 text-sm">{error}</div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-[#D40F14] hover:bg-[#C00D12] text-white font-medium py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Pay ₹{formattedAmount}
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 mt-2 text-center">Secure payment powered by Cashfree</p>
        </div>
      </div>
    </div>
  )
}

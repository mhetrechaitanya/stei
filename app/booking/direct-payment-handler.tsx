"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import PaymentGateway from "@/app/components/payment-gateway"

export function DirectPaymentHandlerComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPayment, setShowPayment] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0,
    orderId: "",
    studentName: "",
    email: "",
    phone: "",
    studentId: "",
  })

  useEffect(() => {
    // Check if we have direct payment parameters
    const directPayment = searchParams.get("directPayment")
    if (directPayment === "true") {
      const amount = Number(searchParams.get("amount") || "0")
      const orderId = searchParams.get("orderId") || `STEI-${Date.now()}`
      const studentName = searchParams.get("name") || ""
      const email = searchParams.get("email") || ""
      const phone = searchParams.get("phone") || ""
      const studentId = searchParams.get("studentId") || ""

      if (amount > 0) {
        setPaymentDetails({
          amount,
          orderId,
          studentName,
          email,
          phone,
          studentId,
        })
        setShowPayment(true)
      }
    }
  }, [searchParams])

  const handlePaymentSuccess = (transactionId: string, details: any) => {
    // Redirect to confirmation page with all necessary parameters
    router.push(
      `/booking/confirmation?orderId=${paymentDetails.orderId}&transactionId=${transactionId}&studentId=${paymentDetails.studentId}`
    )
  }

  const handlePaymentCancel = () => {
    // Redirect back to workshops page
    router.push("/workshops")
  }

  if (!showPayment) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>
          <PaymentGateway
            amount={paymentDetails.amount}
            orderId={paymentDetails.orderId}
            studentName={paymentDetails.studentName}
            studentId={paymentDetails.studentId}
            email={paymentDetails.email}
            phone={paymentDetails.phone}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </div>
      </div>
    </div>
  )
}
"use client"

import React, { JSX, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface PaymentDetails {
  success: boolean
  amount: number
  cf_payment_id?: string
  transaction_id?: string
  order_id: string
  payment_method?: string
  message?: string
}

type PaymentStatus = 'loading' | 'success' | 'error'

export default function PaymentCallbackPage(): JSX.Element {
  const [status, setStatus] = useState<PaymentStatus>('loading')
  const [message, setMessage] = useState<string>('')
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyPayment = async (): Promise<void> => {
      const orderId = searchParams.get('order_id')
      const orderToken = searchParams.get('order_token')

      if (!orderId || !orderToken) {
        setStatus('error')
        setMessage('Missing payment information.')
        return
      }

      try {
        const res = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ orderId, orderToken }),
        })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data: PaymentDetails = await res.json()

        if (data.success) {
          setStatus('success')
          setPaymentDetails(data)
          // Store payment success info (consider using sessionStorage instead of localStorage for sensitive data)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('payment_success', 'true')
            sessionStorage.setItem('payment_details', JSON.stringify(data))
          }
        } else {
          setStatus('error')
          setMessage(data.message || 'Payment verification failed.')
        }
      } catch (err) {
        console.error('Verification error:', err)
        setStatus('error')
        setMessage('Something went wrong while verifying payment.')
      }
    }

    verifyPayment()
  }, [searchParams])

  const handleGoToDashboard = (): void => {
    router.push('/dashboard')
  }

  const handleReturnHome = (): void => {
    router.push('/')
  }

  const handleTryAgain = (): void => {
    router.push('/payment')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-md w-full">
        <div className="bg-[#D40F14] text-white p-4">
          <h2 className="text-lg font-bold">Payment Status</h2>
        </div>

        <div className="p-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-[#D40F14]" />
              <p className="mt-3 text-sm font-medium">Verifying your payment...</p>
            </div>
          )}

          {status === 'success' && paymentDetails && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-green-100 p-3 mb-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-base font-bold text-green-600 mb-2">Payment Successful</h3>
              <p className="text-gray-600 mb-4 text-sm text-center max-w-xs">
                Your payment of ₹{Number(paymentDetails.amount)?.toFixed(2)} has been processed successfully.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 w-full mb-4">
                <h4 className="text-sm font-semibold mb-2">Transaction Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">
                      {paymentDetails.cf_payment_id || paymentDetails.transaction_id || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{paymentDetails.order_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{paymentDetails.payment_method || 'Online'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoToDashboard}
                className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-[#B00D11] transition-colors text-sm"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-red-100 p-3 mb-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-red-600 mb-2">Payment Error</h3>
              <p className="text-gray-600 mb-4 text-sm text-center max-w-xs">{message}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleReturnHome}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  Return Home
                </button>
                <button
                  onClick={handleTryAgain}
                  className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-[#B00D11] transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
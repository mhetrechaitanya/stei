import { ArrowPathIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export default function PaymentPendingPage({ searchParams }) {
  const orderId = searchParams?.order_id || "Unknown"

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <ArrowPathIcon className="h-6 w-6 text-yellow-600 animate-spin" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Payment Processing</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your payment for order <span className="font-medium">{orderId}</span> is still being processed.
            </p>
            <div className="mt-8 space-y-4">
              <p className="text-sm text-gray-500">
                This may take a few moments. You will receive a confirmation once the payment is complete.
              </p>
              <div className="flex flex-col space-y-4">
                <Link
                  href={`/booking/confirmation?order_id=${orderId}`}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D40F14] hover:bg-[#B00D11] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Check Payment Status
                </Link>
                <Link
                  href="/"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

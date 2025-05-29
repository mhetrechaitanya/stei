import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h1>

        <p className="text-gray-600 mb-6">
          We were unable to process your payment. No charges have been made to your account.
        </p>

        <div className="space-y-4">
          <Link
            href="/booking"
            className="block w-full py-2 px-4 bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium rounded-md text-center transition-colors"
          >
            Try Again
          </Link>

          <Link
            href="/"
            className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md text-center transition-colors"
          >
            Return to Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>If you continue to face issues, please contact our support team:</p>
          <p className="mt-2">
            <a href="mailto:support@stei.edu.in" className="text-[#D40F14] hover:underline">
              support@stei.edu.in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

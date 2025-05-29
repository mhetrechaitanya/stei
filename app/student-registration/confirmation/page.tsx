import Link from "next/link"

export default function RegistrationConfirmation() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#D40F14] py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Registration Successful!</h1>
          </div>
          <div className="py-8 px-8 text-center">
            <div className="mb-6 p-4 rounded bg-green-50 text-green-700 border border-green-200">
              <p className="text-lg font-medium">Thank you for registering with us!</p>
              <p className="mt-2">Your registration has been successfully completed.</p>
            </div>

            <p className="mb-6">
              We're excited to have you join our community. You'll receive a confirmation email shortly with more
              details.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link
                href="/"
                className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
              >
                Return to Home
              </Link>
              <Link
                href="/workshops"
                className="px-6 py-3 bg-[#D40F14] text-white font-medium rounded-md hover:bg-[#B00D10] focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:ring-offset-2 transition-colors"
              >
                Explore Workshops
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

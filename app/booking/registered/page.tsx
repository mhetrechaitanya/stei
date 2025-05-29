import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import RegisteredStudentFlow from "./registered-student-flow"

export default function RegisteredStudentPage({ searchParams }) {
  const studentId = searchParams?.studentId
  const workshopId = searchParams?.workshopId

  if (!studentId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Student ID Required</h2>
          <p className="text-gray-600 mb-6">Please verify your identity to continue with the booking process.</p>
          <Link
            href="/booking/landing"
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-red-700"
          >
            Return to Booking
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Simplified */}
      <div className="bg-[#D40F14] text-white py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/booking/landing"
            className="inline-flex items-center text-white/80 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Booking
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Workshop Registration</h1>
          <p className="mt-2">Welcome back! Please select a workshop and batch to continue.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D40F14]"></div>
            </div>
          }
        >
          <RegisteredStudentFlow studentId={studentId} initialWorkshopId={workshopId} />
        </Suspense>
      </div>
    </div>
  )
}

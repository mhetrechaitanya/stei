"use client"

import { useState, useEffect, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import VerificationModal from "./verification-modal"
import { Calendar, Clock, Users } from "lucide-react"

export default function BookingOptions({ workshopId }: { workshopId: string }) {
  const router = useRouter()
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const [verificationError, setVerificationError] = useState("")
  const [workshop, setWorkshop] = useState(null)
  const [batches, setBatches] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchWorkshopData = async () => {
      if (!workshopId) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/workshops/${workshopId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch workshop data")
        }

        const data = await response.json()
        setWorkshop(data)

        // Transform batches data to the format expected by the calendar component
        if (data.batches && Array.isArray(data.batches)) {
          const transformedBatches = data.batches.map((batch: { id: any; date: any; time: any; location: any; slots: any; enrolled: any; instructor: any }) => ({
            id: batch.id,
            date: batch.date,
            timeSlots: [
              {
                id: batch.id,
                time: batch.time,
                location: batch.location || "Online Session",
                slots: batch.slots,
                enrolled: batch.enrolled,
                instructor: batch.instructor,
              },
            ],
          }))

          setBatches(transformedBatches)
        }
      } catch (error) {
        console.error("Error fetching workshop data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkshopData()
  }, [workshopId])

  const handleAlreadyRegistered = () => {
    setVerificationError("")
    setIsVerificationModalOpen(true)
  }

  const handleVerificationSuccess = (studentId: any, studentData: { selectedBatch: any; selectedTimeSlot: any }) => {
    try {
      // Check if studentData contains batch selection
      if (studentData.selectedBatch && studentData.selectedTimeSlot) {
        // Redirect to payment or confirmation page with all data
        router.push(
          `/workshops/${workshopId}/confirmation?studentId=${studentId}&batchId=${studentData.selectedBatch}&timeSlotId=${studentData.selectedTimeSlot}`,
        )
      } else {
        // Redirect to batch selection with student data
        const encodedData = encodeURIComponent(JSON.stringify(studentData))
        router.push(`/workshops/${workshopId}/select-batch?studentId=${studentId}&studentData=${encodedData}`)
      }
    } catch (error) {
      console.error("Navigation error:", error)
      setVerificationError("Failed to proceed to the next step. Please try again.")
    }
  }

  const handleVerificationError = (message: SetStateAction<string>) => {
    setVerificationError(message)
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleAlreadyRegistered}
        className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
      >
        Already Registered
      </button>

      <Link
        href={`/student-registration?redirectTo=/workshops/${workshopId}`}
        className="w-full bg-white border-2 border-[#D40F14] text-[#D40F14] hover:bg-[#FFF5F5] font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
      >
        New Registration
      </Link>

      {verificationError && <div className="text-red-600 text-sm mt-2 text-center">{verificationError}</div>}

      {isVerificationModalOpen && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          onVerificationSuccess={handleVerificationSuccess}
          onVerificationError={handleVerificationError}
          workshopId={workshopId}
          workshop={workshop}
          batches={batches}
        />
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p className="flex items-center mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          Multiple batch options available
        </p>
        <p className="flex items-center mb-2">
          <Clock className="h-4 w-4 mr-2" />
          Flexible timing options
        </p>
        <p className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Limited seats per batch
        </p>
      </div>
    </div>
  )
}

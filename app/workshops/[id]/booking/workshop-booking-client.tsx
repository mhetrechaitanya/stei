"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from "lucide-react"
import VerificationModal from "./verification-modal"

// Ensure the component is properly handling the workshop data
export default function WorkshopBookingClient({ workshop, workshopId }) {
  const router = useRouter()
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)

  const handleBookNow = () => {
    setIsVerificationModalOpen(true)
  }

  const handleVerificationSuccess = (studentId) => {
    // Redirect to batch selection or direct to payment based on your workflow
    router.push(`/workshops/${workshopId}/select-batch?studentId=${studentId}`)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold mb-6">{workshop.title}</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Workshop Details</h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-[#D40F14] mr-3" />
            <div>
              <p className="font-medium">Duration</p>
              <p className="text-gray-600">
                {workshop.sessions || 1} sessions, {workshop.duration || "2 hours"} each
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-[#D40F14] mr-3" />
            <div>
              <p className="font-medium">Schedule</p>
              <p className="text-gray-600">Multiple batches available</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-[#D40F14] mr-3" />
            <div>
              <p className="font-medium">Participants</p>
              <p className="text-gray-600">Limited to {workshop.capacity || 20} per batch</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold">Price:</span>
          <span className="text-2xl font-bold text-[#D40F14]">₹{workshop.price || 0}</span>
        </div>
      </div>

      <Button
        onClick={handleBookNow}
        className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
      >
        <Calendar className="mr-2 h-5 w-5" />
        Book Slot
      </Button>

      {isVerificationModalOpen && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          onSuccess={handleVerificationSuccess}
        />
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import BatchCalendarSelector from "./batch-calendar-selector"
import { Calendar } from "lucide-react"

// Sample workshop data with batches
const sampleWorkshop = {
  id: "workshop-1",
  title: "iACE Interview Preparation Workshop",
  batches: [
    {
      id: "batch-1",
      date: "2025-03-15", // ISO format for dates
      timeSlots: [
        {
          id: "slot-1",
          time: "10:00 AM - 12:00 PM",
          location: "Online",
          slots: 20,
          enrolled: 5,
          instructor: "Dr. Rajesh Kumar",
        },
        {
          id: "slot-2",
          time: "2:00 PM - 4:00 PM",
          location: "Online",
          slots: 20,
          enrolled: 18,
          instructor: "Dr. Rajesh Kumar",
        },
      ],
    },
    {
      id: "batch-2",
      date: "2025-03-18",
      timeSlots: [
        {
          id: "slot-3",
          time: "6:00 PM - 8:00 PM",
          location: "Online",
          slots: 15,
          enrolled: 7,
          instructor: "Dr. Priya Singh",
        },
      ],
    },
    {
      id: "batch-3",
      date: "2025-03-22",
      timeSlots: [
        {
          id: "slot-4",
          time: "9:00 AM - 11:00 AM",
          location: "Bangalore Center",
          slots: 12,
          enrolled: 12, // Full batch
          instructor: "Dr. Rajesh Kumar",
        },
      ],
    },
    {
      id: "batch-4",
      date: "2025-03-25",
      timeSlots: [
        {
          id: "slot-5",
          time: "10:00 AM - 12:00 PM",
          location: "Online",
          slots: 20,
          enrolled: 3,
          instructor: "Dr. Priya Singh",
        },
        {
          id: "slot-6",
          time: "3:00 PM - 5:00 PM",
          location: "Online",
          slots: 15,
          enrolled: 10,
          instructor: "Dr. Amit Sharma",
        },
      ],
    },
    {
      id: "batch-5",
      date: "2025-04-05",
      timeSlots: [
        {
          id: "slot-7",
          time: "10:00 AM - 12:00 PM",
          location: "Online",
          slots: 20,
          enrolled: 2,
          instructor: "Dr. Priya Singh",
        },
      ],
    },
  ],
}

export default function BatchCalendarDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBatchInfo, setSelectedBatchInfo] = useState<{
    batchId: string
    timeSlotId: string
  } | null>(null)

  const handleOpenCalendar = () => {
    setIsOpen(true)
  }

  const handleCloseCalendar = () => {
    setIsOpen(false)
  }

  const handleBatchSelected = (batchId: string, timeSlotId: string) => {
    setSelectedBatchInfo({ batchId, timeSlotId })
  }

  // Find the selected batch and time slot details
  const getSelectedBatchDetails = () => {
    if (!selectedBatchInfo) return null

    const batch = sampleWorkshop.batches.find((b) => b.id === selectedBatchInfo.batchId)
    if (!batch) return null

    const timeSlot = batch.timeSlots.find((ts) => ts.id === selectedBatchInfo.timeSlotId)
    if (!timeSlot) return null

    return {
      date: batch.date,
      timeSlot,
    }
  }

  const selectedDetails = getSelectedBatchDetails()

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Workshop Batch Selection</h2>

        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">{sampleWorkshop.title}</h3>
          <p className="text-gray-600 mb-4">
            Select a batch date and time that works best for you. Available batches are highlighted on the calendar.
          </p>
        </div>

        {selectedDetails ? (
          <div className="mb-6 p-6 bg-[#FFF5F5] border border-[#FFCDD2] rounded-lg">
            <h4 className="font-bold text-lg mb-3 text-[#D40F14]">Your Selected Batch</h4>

            <div className="space-y-3">
              <p>
                <strong>Date:</strong> {formatDate(selectedDetails.date)}
              </p>
              <p>
                <strong>Time:</strong> {selectedDetails.timeSlot.time}
              </p>
              <p>
                <strong>Location:</strong> {selectedDetails.timeSlot.location}
              </p>
              <p>
                <strong>Instructor:</strong> {selectedDetails.timeSlot.instructor}
              </p>
              <p>
                <strong>Available Slots:</strong> {selectedDetails.timeSlot.slots - selectedDetails.timeSlot.enrolled}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No batch selected yet. Click the button below to choose a batch.</p>
          </div>
        )}

        <button
          onClick={handleOpenCalendar}
          className="flex items-center justify-center w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          <Calendar className="mr-2 h-5 w-5" />
          {selectedDetails ? "Change Selected Batch" : "Select a Batch"}
        </button>
      </div>

      <BatchCalendarSelector
        isOpen={isOpen}
        onClose={handleCloseCalendar}
        workshop={sampleWorkshop}
        onBatchSelected={handleBatchSelected}
      />
    </div>
  )
}

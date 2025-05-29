"use client"

import { useState } from "react"
import WorkshopBatchCalendar from "../components/workshop-batch-calendar"

// Sample workshop data
const sampleWorkshop = {
  id: "sample-workshop-1",
  title: "Sample Workshop",
  description: "This is a sample workshop for testing batch selection",
  price: 1999,
}

// Sample batch data with different date formats
const sampleBatches = [
  {
    id: "batch-1",
    date: "15 May 2025", // Format: DD Month YYYY
    timeSlots: [
      {
        id: "ts-1",
        time: "10:00 AM - 12:00 PM",
        location: "Online",
        slots: 20,
        enrolled: 5,
      },
      {
        id: "ts-2",
        time: "2:00 PM - 4:00 PM",
        location: "Online",
        slots: 20,
        enrolled: 10,
      },
    ],
  },
  {
    id: "batch-2",
    date: "2025-05-20", // ISO format
    timeSlots: [
      {
        id: "ts-3",
        time: "11:00 AM - 1:00 PM",
        location: "Online",
        slots: 15,
        enrolled: 7,
      },
    ],
  },
  {
    id: "batch-3",
    date: "25 May 2025",
    timeSlots: [
      {
        id: "ts-4",
        time: "9:00 AM - 11:00 AM",
        location: "Online",
        slots: 25,
        enrolled: 0,
      },
    ],
  },
]

export default function BatchTestPage() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null)

  const handleBatchSelected = (batchId: string, timeSlotId: string) => {
    setSelectedBatchId(batchId)
    setSelectedTimeSlotId(timeSlotId)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Batch Calendar Test Page</h1>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="mb-4">
          This page tests the batch calendar component with sample data. Click the button below to open the calendar.
        </p>

        <button
          onClick={() => setIsCalendarOpen(true)}
          className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-[#B00D11] transition-colors"
        >
          Open Batch Calendar
        </button>
      </div>

      {selectedBatchId && selectedTimeSlotId && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            <strong>Selected Batch:</strong> {selectedBatchId}
          </p>
          <p className="text-green-800">
            <strong>Selected Time Slot:</strong> {selectedTimeSlotId}
          </p>
        </div>
      )}

      <WorkshopBatchCalendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        workshop={sampleWorkshop}
        batches={sampleBatches}
        onBatchSelected={handleBatchSelected}
        onContinue={() => alert("Continuing to booking...")}
        debug={true}
      />
    </div>
  )
}

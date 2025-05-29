"use client"

import { useState } from "react"
import WorkshopBatchCalendar from "./workshop-batch-calendar"

// Sample data
const sampleWorkshop = {
  id: "1",
  title: "Advanced JavaScript Workshop",
  description: "Master modern JavaScript concepts and techniques with hands-on exercises",
  price: 2999,
  image: "/placeholder.svg?height=200&width=200",
}

const sampleBatches = [
  {
    id: "batch1",
    date: "15 March 2025",
    timeSlots: [
      {
        id: "ts1",
        time: "10:00 AM - 12:00 PM",
        location: "Online (Zoom)",
        slots: 20,
        enrolled: 12,
        instructor: "John Doe",
      },
      {
        id: "ts2",
        time: "2:00 PM - 4:00 PM",
        location: "Online (Zoom)",
        slots: 20,
        enrolled: 5,
        instructor: "Jane Smith",
      },
    ],
  },
  {
    id: "batch2",
    date: "22 March 2025",
    timeSlots: [
      {
        id: "ts3",
        time: "10:00 AM - 12:00 PM",
        location: "Online (Zoom)",
        slots: 20,
        enrolled: 18,
        instructor: "John Doe",
      },
    ],
  },
  {
    id: "batch3",
    date: "29 March 2025",
    timeSlots: [
      {
        id: "ts4",
        time: "10:00 AM - 12:00 PM",
        location: "Online (Zoom)",
        slots: 20,
        enrolled: 8,
        instructor: "Jane Smith",
      },
      {
        id: "ts5",
        time: "2:00 PM - 4:00 PM",
        location: "Online (Zoom)",
        slots: 20,
        enrolled: 15,
        instructor: "John Doe",
      },
    ],
  },
]

export default function WorkshopBatchSelectorDemo() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<{ batchId: string; timeSlotId: string } | null>(null)

  const handleBatchSelected = (batchId: string, timeSlotId: string) => {
    setSelectedBatch({ batchId, timeSlotId })
  }

  const handleContinue = () => {
    setIsCalendarOpen(false)
    // In a real application, you would redirect to the next step in the booking process
    console.log("Selected batch:", selectedBatch)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Workshop Batch Selection Demo</h1>

      <div className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4">{sampleWorkshop.title}</h2>
        <p className="mb-4">{sampleWorkshop.description}</p>
        <p className="text-lg font-bold mb-6">₹{sampleWorkshop.price}</p>

        <button
          onClick={() => setIsCalendarOpen(true)}
          className="px-6 py-3 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11] transition-colors"
        >
          Select Batch
        </button>
      </div>

      {selectedBatch && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-bold text-green-800 mb-2">Selected Batch Information</h3>
          <p>Batch ID: {selectedBatch.batchId}</p>
          <p>Time Slot ID: {selectedBatch.timeSlotId}</p>
        </div>
      )}

      <WorkshopBatchCalendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        workshop={sampleWorkshop}
        batches={sampleBatches}
        onBatchSelected={handleBatchSelected}
      />
    </div>
  )
}

"use client"

import { useState } from "react"
import WorkshopBatchCalendar from "../components/workshop-batch-calendar"
import { generateMockWorkshop } from "@/lib/mock-data"
import { parseFlexibleDate } from "@/lib/date-utils"

export default function BatchCalendarTestPage() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null)
  const [mockWorkshop] = useState(generateMockWorkshop())

  const handleBatchSelected = (batchId: string, timeSlotId: string) => {
    setSelectedBatchId(batchId)
    setSelectedTimeSlotId(timeSlotId)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Batch Calendar Test Page</h1>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="mb-4">
          This page tests the batch calendar component with generated mock data. Click the button below to open the
          calendar.
        </p>

        <button
          onClick={() => setIsCalendarOpen(true)}
          className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-[#B00D11] transition-colors"
        >
          Open Batch Calendar
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Mock Workshop Data</h2>
        <p>
          <strong>Workshop ID:</strong> {mockWorkshop.id}
        </p>
        <p>
          <strong>Title:</strong> {mockWorkshop.title}
        </p>
        <p>
          <strong>Price:</strong> ₹{mockWorkshop.price}
        </p>
        <p>
          <strong>Batches:</strong> {mockWorkshop.batches.length}
        </p>

        <details className="mt-4">
          <summary className="cursor-pointer text-blue-600">View Batch Details</summary>
          <div className="mt-2 p-2 bg-white rounded-lg">
            <ul className="space-y-4">
              {mockWorkshop.batches.map((batch, index) => (
                <li key={batch.id} className="border-b pb-2">
                  <p>
                    <strong>Batch {index + 1}:</strong> {batch.id}
                  </p>
                  <p>
                    <strong>Date:</strong> {batch.date}
                  </p>
                  <p>
                    <strong>Parsed Date:</strong> {parseFlexibleDate(batch.date)?.toDateString() || "Invalid date"}
                  </p>
                  <p>
                    <strong>Time Slots:</strong> {batch.timeSlots.length}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </details>
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
        workshop={mockWorkshop}
        batches={mockWorkshop.batches}
        onBatchSelected={handleBatchSelected}
        onContinue={() => alert("Continuing to booking...")}
        debug={true}
      />
    </div>
  )
}

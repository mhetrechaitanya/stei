"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, ArrowLeft, Users } from "lucide-react"

interface BatchSelectorProps {
  workshop: any
  onSelect: (batch: any) => void
  onBack: () => void
  studentData?: any
}

export default function BatchSelector({ workshop, onSelect, onBack, studentData }: BatchSelectorProps) {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)

  const handleBatchSelect = (batchId: string) => {
    setSelectedBatchId(batchId)
  }

  const handleContinue = () => {
    if (!selectedBatchId && workshop.batches && workshop.batches.length > 0) {
      // If no batch is selected, select the first one
      setSelectedBatchId(workshop.batches[0].id)
      onSelect(workshop.batches[0])
    } else if (selectedBatchId && workshop.batches) {
      // Find the selected batch
      const selectedBatch = workshop.batches.find((batch: any) => batch.id === selectedBatchId)
      if (selectedBatch) {
        onSelect(selectedBatch)
      }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold">Select a Batch</h2>
      </div>

      {studentData && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="font-medium">
            Booking for: <span className="text-blue-700">{studentData.name}</span>
          </p>
          <p className="text-sm text-gray-600">
            {studentData.email} | {studentData.phone}
          </p>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2">Workshop: {workshop.title}</h3>
        <p className="text-gray-600 mb-4">{workshop.description}</p>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-[#D40F14] mr-2" />
            <span>{workshop.sessions} Sessions</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-[#D40F14] mr-2" />
            <span>{workshop.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-[#D40F14] mr-2" />
            <span>Max {workshop.capacity} participants</span>
          </div>
        </div>
        <div className="bg-[#FFF5F5] p-3 rounded-lg inline-block">
          <p className="font-bold text-xl text-[#D40F14]">₹{workshop.price}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-4">Available Batches:</h3>
        {workshop.batches && workshop.batches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workshop.batches.map((batch: any, index: number) => (
              <div
                key={batch.id || index}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedBatchId === batch.id
                    ? "border-[#D40F14] bg-[#FFF5F5] shadow-md"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
                onClick={() => handleBatchSelect(batch.id)}
              >
                <div className="font-bold mb-2">Batch {index + 1}</div>
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 text-[#D40F14] mr-2" />
                  <span className="text-sm">{batch.date}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-[#D40F14] mr-2" />
                  <span className="text-sm">{batch.time}</span>
                </div>
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-[#D40F14] mr-2" />
                  <span className="text-sm">{batch.location || "Online Session"}</span>
                </div>
                <div className="text-sm mt-2">
                  <span className="font-medium text-[#D40F14]">{batch.slots - (batch.enrolled || 0)}</span> slots left
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No batches available for this workshop.</p>
            <p className="text-sm text-gray-400 mt-2">Please check back later or contact support.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          
          className="px-6 py-2 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11] transition-colors"
          disabled={!selectedBatchId && workshop.batches && workshop.batches.length > 0}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  )
}

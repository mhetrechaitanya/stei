"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin } from "lucide-react"

interface SimplifiedBatchSelectorProps {
  workshop: any
  onBatchSelected: (batch: any) => void
  onContinueToPayment: () => void
}

export default function SimplifiedBatchSelector({
  workshop,
  onBatchSelected,
  onContinueToPayment,
}: SimplifiedBatchSelectorProps) {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleBatchSelect = (batchId: string) => {
    setSelectedBatchId(batchId)
    const selectedBatch = workshop.batches?.find((batch) => batch.id === batchId)
    if (selectedBatch) {
      onBatchSelected(selectedBatch)
    }
    setError("")
  }

  const handleContinue = () => {
    if (!selectedBatchId) {
      setError("Please select a batch to continue")
      return
    }

    const batch = workshop.batches?.find((b) => b.id === selectedBatchId)
    if (batch && batch.enrolled >= batch.slots) {
      setError("This batch is full. Please select another batch.")
      return
    }

    setError("")
    onContinueToPayment()
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Select a Batch</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-4">Available Batches:</h3>
        {workshop.batches && workshop.batches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workshop.batches.map((batch, index) => {
              const isFull = batch.slots - batch.enrolled <= 0
              return (
                <div
                  key={batch.id || index}
                  className={`p-4 rounded-lg border transition-all ${
                    isFull
                      ? "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
                      : selectedBatchId === batch.id
                        ? "border-[#D40F14] bg-[#FFF5F5] shadow-md cursor-pointer"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 cursor-pointer"
                  }`}
                  onClick={() => !isFull && handleBatchSelect(batch.id)}
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
                    <span className="text-sm">Online Session</span>
                  </div>
                  <div className="text-sm mt-2">
                    {isFull ? (
                      <span className="font-medium text-gray-500">Batch Full</span>
                    ) : (
                      <>
                        <span className="font-medium text-[#D40F14]">{batch.slots - batch.enrolled}</span> slots left
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No batches available for this workshop.</p>
            <p className="text-sm text-gray-400 mt-2">Please check back later or contact support.</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          className="px-6 py-2 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11] transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  )
}

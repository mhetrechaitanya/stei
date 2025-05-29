"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, ArrowLeft, User, AlertCircle } from "lucide-react"
import DirectPaymentHandler from "@/app/components/direct-payment-handler"
import WorkshopBatchCalendar from "@/app/components/workshop-batch-calendar"

export default function BatchSelectionClient({ workshop, studentId, studentData }) {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [formattedBatches, setFormattedBatches] = useState([])

  // Log the props to help with debugging
  useEffect(() => {
    console.log("BatchSelectionClient props:", { workshop, studentId, studentData })

    // Format batches for the calendar
    if (workshop.batches && Array.isArray(workshop.batches)) {
      const formatted = workshop.batches.map((batch) => {
        // Create a time slot from the batch data
        const timeSlot = {
          id: batch.id,
          time: batch.time || "10:00 AM - 12:00 PM",
          location: batch.location || "Online",
          slots: batch.slots || 15,
          enrolled: batch.enrolled || 0,
        }

        // Check if this is a TBD batch
        const isTBD = batch.date?.includes("TBD") || !batch.date

        // Return the formatted batch with the time slot
        return {
          id: batch.id,
          date: batch.date || "TBD",
          timeSlots: [timeSlot],
          isTBD: isTBD,
        }
      })

      setFormattedBatches(formatted)
      console.log("Formatted batches:", formatted)
    }
  }, [workshop, studentId, studentData])

  const selectedBatch = workshop.batches?.find((batch) => batch.id === selectedBatchId)

  const handleBatchSelect = async (batchId: string) => {
    try {
      setSelectedBatchId(batchId)
      setError("")
    } catch (error) {
      console.error("Error selecting batch:", error)
      alert("There was an error selecting this batch. Please try again.")
    }
  }

  const handleContinueToPayment = () => {
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
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = async (transactionId: string, paymentDetails: any) => {
    try {
      setIsProcessing(true)

      // Record enrollment in database
      const response = await fetch("/api/enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          workshopId: workshop.id,
          batchId: selectedBatchId,
          orderId: paymentDetails.orderId,
          transactionId,
          paymentDetails,
          amount: workshop.price,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to confirmation page
        window.location.href = `/booking/confirmation?orderId=${paymentDetails.orderId}&transactionId=${transactionId}&studentId=${studentId}`
      } else {
        console.error("Enrollment failed:", data.message)
        setError(data.message || "There was an error recording your enrollment. Please contact support.")
        setIsPaymentModalOpen(false)
      }
    } catch (error) {
      console.error("Error recording enrollment:", error)
      setError("There was an error recording your enrollment. Please contact support.")
      setIsPaymentModalOpen(false)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOpenCalendar = () => {
    setIsCalendarOpen(true)
  }

  const handleBatchSelected = (batchId: string, timeSlotId: string) => {
    setSelectedBatchId(batchId)
    setError("")
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b">
        <Link
          href={`/workshops/${workshop.id}/booking`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workshop Booking
        </Link>
        <h1 className="text-2xl font-bold">Select a Batch</h1>
      </div>

      {/* Student Info */}
      <div className="p-6 bg-blue-50 border-b">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-2 mr-4">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-lg">{studentData.name}</p>
            <p className="text-gray-600">
              {studentData.email} | {studentData.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Workshop Info */}
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 relative h-40 md:h-auto rounded-lg overflow-hidden">
            <Image
              src={workshop.image || "/placeholder.svg?height=200&width=200"}
              alt={workshop.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="md:w-3/4">
            <h2 className="text-xl font-bold mb-2">{workshop.title}</h2>
            <p className="text-gray-600 mb-4">{workshop.short_description || workshop.description}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-[#D40F14] mr-2" />
                <span>{workshop.sessions || 1} Sessions</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-[#D40F14] mr-2" />
                <span>{workshop.duration || "2 hours"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Calendar View Button */}
      <div className="p-6">
        <button
          onClick={handleOpenCalendar}
          className="w-full py-3 px-4 bg-[#FFF5F5] text-[#D40F14] font-medium rounded-lg hover:bg-[#FFECEC] transition-colors flex items-center justify-center"
        >
          <Calendar className="h-5 w-5 mr-2" />
          View Batches in Calendar
        </button>
      </div>

      {/* Batch Selection */}
      <div className="p-6">
        <h3 className="text-lg font-bold mb-4">Available Batches:</h3>
        {workshop.batches && workshop.batches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
          <div className="text-center p-8 bg-gray-50 rounded-lg mb-8">
            <p className="text-gray-500">No batches available for this workshop.</p>
            <p className="text-sm text-gray-400 mt-2">Please check back later or contact support.</p>
          </div>
        )}

        {/* Price and Continue Button */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t pt-6">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">Workshop Fee:</p>
            <p className="text-2xl font-bold text-[#D40F14]">₹{workshop.price}</p>
          </div>
          <button
            onClick={handleContinueToPayment}
            disabled={!selectedBatchId || isProcessing}
            className="px-6 py-3 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>

      {/* Calendar Modal */}
      <WorkshopBatchCalendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        workshop={{
          id: workshop.id,
          title: workshop.title,
          description: workshop.description,
          price: workshop.price || 4999,
          image: workshop.image,
        }}
        batches={formattedBatches}
        onBatchSelected={handleBatchSelected}
        onContinue={() => {
          setIsCalendarOpen(false)
          handleContinueToPayment()
        }}
        debug={true}
      />

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedBatch && (
        <DirectPaymentHandler
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          studentData={studentData}
          workshopData={workshop}
          selectedBatch={selectedBatch}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

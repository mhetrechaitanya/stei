"use client"

import { useState } from "react"
import CalendarBatchSelector from "./calendar-batch-selector"
import { Calendar } from "lucide-react"

// Sample workshop data
const sampleWorkshop = {
  id: "1",
  title: "iACE Interview Preparation Workshop",
  description: "Master the art of cracking technical interviews with our comprehensive workshop",
  price: 2999,
  batches: [
    {
      id: "batch1",
      date: "15 March 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Online",
      slots: 20,
      enrolled: 5,
      instructor: "Dr. Rajesh Kumar",
    },
    {
      id: "batch2",
      date: "15 March 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Online",
      slots: 20,
      enrolled: 18,
      instructor: "Dr. Rajesh Kumar",
    },
    {
      id: "batch3",
      date: "18 March 2025",
      time: "6:00 PM - 8:00 PM",
      location: "Online",
      slots: 15,
      enrolled: 7,
      instructor: "Dr. Priya Singh",
    },
    {
      id: "batch4",
      date: "22 March 2025",
      time: "9:00 AM - 11:00 AM",
      location: "Bangalore Center",
      slots: 12,
      enrolled: 12, // Full batch
      instructor: "Dr. Rajesh Kumar",
    },
    {
      id: "batch5",
      date: "25 March 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Online",
      slots: 20,
      enrolled: 3,
      instructor: "Dr. Priya Singh",
    },
    {
      id: "batch6",
      date: "28 March 2025",
      time: "4:00 PM - 6:00 PM",
      location: "Online",
      slots: 15,
      enrolled: 10,
      instructor: "Dr. Rajesh Kumar",
    },
    {
      id: "batch7",
      date: "5 April 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Online",
      slots: 20,
      enrolled: 2,
      instructor: "Dr. Priya Singh",
    },
  ],
}

export default function BatchSelectionDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<any>(null)
  const [bookingComplete, setBookingComplete] = useState(false)

  const handleOpenCalendar = () => {
    setIsOpen(true)
  }

  const handleCloseCalendar = () => {
    setIsOpen(false)
  }

  const handleBatchSelected = (batch: any) => {
    setSelectedBatch(batch)
  }

  const handleContinue = () => {
    setIsOpen(false)
    setBookingComplete(true)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Workshop Registration</h2>

        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">{sampleWorkshop.title}</h3>
          <p className="text-gray-600 mb-4">{sampleWorkshop.description}</p>
          <div className="bg-[#FFF5F5] p-3 rounded-lg inline-block">
            <p className="font-bold text-xl text-[#D40F14]">₹{sampleWorkshop.price}</p>
          </div>
        </div>

        {selectedBatch && !bookingComplete ? (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Selected Batch</h4>
            <p>Date: {selectedBatch.date}</p>
            <p>Time: {selectedBatch.time}</p>
            <p>Location: {selectedBatch.location}</p>
            <p>Available Slots: {selectedBatch.slots - selectedBatch.enrolled}</p>
          </div>
        ) : null}

        {bookingComplete ? (
          <div className="p-6 bg-green-50 rounded-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Booking Confirmed!</h3>
            <p className="text-green-700 mb-4">
              You have successfully booked a slot for {sampleWorkshop.title} on {selectedBatch?.date} at{" "}
              {selectedBatch?.time}.
            </p>
            <button
              onClick={() => {
                setSelectedBatch(null)
                setBookingComplete(false)
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Book Another Batch
            </button>
          </div>
        ) : (
          <button
            onClick={handleOpenCalendar}
            className="flex items-center justify-center w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            <Calendar className="mr-2 h-5 w-5" />
            {selectedBatch ? "Change Selected Batch" : "Select a Batch"}
          </button>
        )}
      </div>

      <CalendarBatchSelector
        isOpen={isOpen}
        onClose={handleCloseCalendar}
        workshop={sampleWorkshop}
        onBatchSelected={handleBatchSelected}
        onContinue={handleContinue}
      />
    </div>
  )
}

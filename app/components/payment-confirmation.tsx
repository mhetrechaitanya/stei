"use client"

import { useState } from "react"
import { CheckCircle, ArrowLeft } from "lucide-react"
import Image from "next/image"

interface PaymentConfirmationProps {
  studentData: any
  workshopData: any
  batchData: any
  onBack: () => void
  onProceed: () => void
}

export default function PaymentConfirmation({
  studentData,
  workshopData,
  batchData,
  onBack,
  onProceed,
}: PaymentConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleProceedToPayment = () => {
    setIsLoading(true)
    onProceed()
  }

  // Format the workshop title to match the design
  const formatTitle = (title: string) => {
    if (title.toLowerCase().includes("iace")) {
      return (
        <>
          i<span className="text-[#D40F14]">ACE</span> {title.replace(/iace/i, "").trim()}
        </>
      )
    }
    return title
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
        <h2 className="text-2xl font-bold">Payment Details</h2>
      </div>

      <div className="flex items-center mb-6">
        <div className="w-16 h-16 relative rounded-md overflow-hidden mr-4">
          <Image
            src={workshopData.image || "/placeholder.svg?height=64&width=64"}
            alt={workshopData.title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-bold text-lg">{formatTitle(workshopData.title)}</h3>
          <p className="text-sm text-gray-600">
            {workshopData.sessions} Sessions • {workshopData.duration?.split(" ")[0] || "2"} hours per session
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium mb-3">Student Information</h4>
        <p className="mb-1">
          <span className="font-medium">Name:</span> {studentData.name}
        </p>
        <p className="mb-1">
          <span className="font-medium">Email:</span> {studentData.email}
        </p>
        <p>
          <span className="font-medium">Phone:</span> {studentData.phone}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium mb-3">Batch Information</h4>
        <p className="mb-1">
          <span className="font-medium">Date:</span> {batchData.date}
        </p>
        <p className="mb-1">
          <span className="font-medium">Time:</span> {batchData.time}
        </p>
        <p>
          <span className="font-medium">Location:</span> {batchData.location || "Online Session"}
        </p>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Workshop Fee:</span>
          <span className="text-xl font-bold text-[#D40F14]">₹{workshopData.price}</span>
        </div>
        {workshopData.original_price && workshopData.original_price > workshopData.price && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Original Price:</span>
            <span className="text-gray-500 line-through">₹{workshopData.original_price}</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span>Workshop Fee</span>
          <span>₹{workshopData.price}</span>
        </div>
        <div className="flex justify-between mb-2 text-green-600">
          <span>Discount</span>
          <span>₹0</span>
        </div>
        <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
          <span>Total Amount</span>
          <span>₹{workshopData.price}</span>
        </div>
      </div>

      <div className="bg-[#FFF5F5] p-4 rounded-lg mb-6">
        <h4 className="font-medium mb-3">Payment Information</h4>
        <ul className="space-y-3">
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
            <span>Secure payment gateway with end-to-end encryption</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
            <span>Multiple payment options available (Cards, UPI, Net Banking)</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
            <span>You'll receive a confirmation email after successful payment</span>
          </li>
        </ul>
      </div>

      <button
        onClick={handleProceedToPayment}
        disabled={isLoading}
        className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 disabled:opacity-70"
      >
        {isLoading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  )
}

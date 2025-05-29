"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import BatchSelector from "../landing/batch-selector"
import PaymentPopup from "../landing/payment-popup"

export default function WorkshopSelectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const studentId = searchParams.get("studentId")
  const studentDataParam = searchParams.get("studentData")

  const [workshops, setWorkshops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [showBatchSelector, setShowBatchSelector] = useState(false)
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [studentData, setStudentData] = useState(null)

  useEffect(() => {
    // Parse student data
    if (studentDataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(studentDataParam))
        setStudentData(parsedData)
      } catch (e) {
        console.error("Error parsing student data:", e)
      }
    }

    // Fetch workshops
    const fetchWorkshops = async () => {
      try {
        const response = await fetch("/api/workshops")
        if (!response.ok) {
          throw new Error("Failed to fetch workshops")
        }
        const data = await response.json()
        setWorkshops(data.workshops || [])
      } catch (err) {
        setError(err.message || "Failed to load workshops")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshops()
  }, [studentDataParam])

  const handleWorkshopSelect = (workshop) => {
    setSelectedWorkshop(workshop)
    setShowBatchSelector(true)
  }

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch)
    // Generate order ID
    setOrderId(`STEI-${Date.now()}`)
    setShowPaymentPopup(true)
  }

  const handlePaymentSuccess = async (transactionId, paymentDetails) => {
    try {
      // Save enrollment to database
      const response = await fetch("/api/enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          workshopId: selectedWorkshop.id,
          batchId: selectedBatch.id,
          orderId,
          transactionId,
          amount: selectedWorkshop.price,
          paymentDetails,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save enrollment")
      }

      // Redirect to confirmation page
      router.push(`/booking/confirmation?order_id=${orderId}`)
    } catch (error) {
      console.error("Error saving enrollment:", error)
      setError("Failed to complete enrollment. Please contact support.")
    }
  }

  const handleBackFromBatchSelector = () => {
    setShowBatchSelector(false)
    setSelectedWorkshop(null)
  }

  const handlePaymentCancel = () => {
    setShowPaymentPopup(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D40F14]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <Link
            href="/workshops"
            className="inline-flex items-center bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workshops
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Student Info */}
          {studentData && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center">
                <div className="bg-[#D40F14]/10 p-3 rounded-full mr-4">
                  <User className="h-6 w-6 text-[#D40F14]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{studentData.name}</h2>
                  <p className="text-gray-600">
                    {studentData.email} | {studentData.phone}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showBatchSelector ? (
            <BatchSelector
              workshop={selectedWorkshop}
              onSelect={handleBatchSelect}
              onBack={handleBackFromBatchSelector}
              studentData={studentData}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Link
                  href="/workshops"
                  className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h2 className="text-2xl font-bold">Select a Workshop</h2>
              </div>

              {workshops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {workshops.map((workshop) => (
                    <div
                      key={workshop.id}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleWorkshopSelect(workshop)}
                    >
                      <div className="relative h-48">
                        <Image
                          src={workshop.image || "/placeholder.svg?height=200&width=400"}
                          alt={workshop.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{workshop.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{workshop.description}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {workshop.sessions} Sessions
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            ₹{workshop.price}
                          </span>
                        </div>

                        {workshop.batches && workshop.batches.length > 0 && (
                          <div className="text-sm text-gray-500">
                            <div className="flex items-center mb-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Next batch: {workshop.batches[0].date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{workshop.batches[0].time}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No workshops available at this time.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showPaymentPopup && selectedWorkshop && (
        <PaymentPopup
          amount={selectedWorkshop.price}
          studentName={studentData?.name || ""}
          email={studentData?.email || ""}
          phone={studentData?.phone || ""}
          orderId={orderId}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  )
}

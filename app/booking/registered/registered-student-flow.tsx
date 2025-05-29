"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import EnhancedBatchSelector from "@/app/components/enhanced-batch-selector"
import PaymentSummary from "@/app/components/payment-summary"

interface RegisteredStudentFlowProps {
  studentId: string
  initialWorkshopId?: string
}

export default function RegisteredStudentFlow({ studentId, initialWorkshopId }: RegisteredStudentFlowProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [studentData, setStudentData] = useState(null)
  const [workshops, setWorkshops] = useState([])
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [showBatchSelector, setShowBatchSelector] = useState(false)
  const [showPaymentSummary, setShowPaymentSummary] = useState(false)
  const router = useRouter()

  // Fetch student data and workshops
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")

        // Fetch student data
        const studentResponse = await fetch(`/api/student/${studentId}`)
        if (!studentResponse.ok) {
          throw new Error("Failed to fetch student data")
        }
        const studentResult = await studentResponse.json()
        setStudentData(studentResult.data)

        // Fetch workshops
        const workshopsResponse = await fetch("/api/workshops")
        if (!workshopsResponse.ok) {
          throw new Error("Failed to fetch workshops")
        }
        const workshopsResult = await workshopsResponse.json()
        setWorkshops(workshopsResult.data || [])

        // If initialWorkshopId is provided, select that workshop
        if (initialWorkshopId && workshopsResult.data) {
          const workshop = workshopsResult.data.find((w) => w.id.toString() === initialWorkshopId.toString())
          if (workshop) {
            setSelectedWorkshop(workshop)
            setShowBatchSelector(true)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (studentId) {
      fetchData()
    }
  }, [studentId, initialWorkshopId])

  const handleWorkshopSelect = (workshop) => {
    setSelectedWorkshop(workshop)
    setShowBatchSelector(true)
  }

  const handleBatchSelected = (batch) => {
    setSelectedBatch(batch)
  }

  const handleContinueToPayment = () => {
    setShowPaymentSummary(true)
  }

  const handlePaymentSuccess = async (transactionId, paymentDetails) => {
    try {
      // Create enrollment record
      const enrollmentResponse = await fetch("/api/enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          workshopId: selectedWorkshop.id,
          batchId: selectedBatch.id,
          transactionId,
          amount: selectedWorkshop.price || 4999,
          paymentStatus: "SUCCESS",
          paymentMethod: paymentDetails.paymentMethod || "online",
          orderId: paymentDetails.orderId,
        }),
      })

      if (!enrollmentResponse.ok) {
        throw new Error("Failed to create enrollment record")
      }

      const enrollmentResult = await enrollmentResponse.json()

      // Redirect to confirmation page
      router.push(`/booking/confirmation?orderId=${paymentDetails.orderId}&transactionId=${transactionId}`)
    } catch (error) {
      console.error("Error creating enrollment:", error)
      setError("Failed to complete enrollment. Please contact support.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D40F14]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => router.push("/booking/landing")}
          className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-[#B00D11] transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!showBatchSelector) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Select a Workshop</h2>

        {workshops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => (
              <div
                key={workshop.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleWorkshopSelect(workshop)}
              >
                <div className="h-40 bg-gray-200 relative">
                  <img
                    src={workshop.image || "/placeholder.svg?height=200&width=300"}
                    alt={workshop.title}
                    className="w-full h-full object-cover"
                  />
                  {workshop.featured && (
                    <div className="absolute top-0 left-0 bg-[#D40F14] text-white px-2 py-1 text-xs font-bold">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{workshop.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{workshop.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#D40F14]">₹{workshop.price || 4999}</span>
                    <span className="text-sm text-gray-500">{workshop.duration || "8 hours"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No workshops available at the moment.</p>
            <p className="text-sm text-gray-400 mt-2">Please check back later or contact support.</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {showBatchSelector && selectedWorkshop && !showPaymentSummary && (
        <EnhancedBatchSelector
          workshop={selectedWorkshop}
          onBatchSelected={handleBatchSelected}
          onContinue={handleContinueToPayment}
        />
      )}

      {showPaymentSummary && selectedWorkshop && selectedBatch && studentData && (
        <PaymentSummary
          studentData={studentData}
          workshopData={selectedWorkshop}
          selectedBatch={selectedBatch}
          onCancel={() => setShowPaymentSummary(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  )
}

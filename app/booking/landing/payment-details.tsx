"use client"

import { useState, useEffect } from "react"
import { CheckCircle, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface PaymentDetailsProps {
  studentData: any
  workshopData: any
  selectedBatch: any
  onCancel: () => void
  onProceed: () => void
  orderId?: string
}

export default function PaymentDetails({
  studentData,
  workshopData,
  selectedBatch,
  onCancel,
  onProceed,
  orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
}: PaymentDetailsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  console.log("students data : ", studentData, " workshop data : ", workshopData, " selected batch : ", selectedBatch);

  // Add debugging log when component mounts
  useEffect(() => {
    console.log("Payment Details rendered with:", {
      student: studentData,
      workshop: workshopData,
      selectedBatch,
      orderId,
    })
  }, [studentData, workshopData, selectedBatch, orderId])

  // const handleProceedToPayment = () => {
  //   setIsLoading(true)

  //   try {
  //     // Call the onProceed function without parameters
  //     onProceed()
  //   } catch (error) {
  //     console.error("Error proceeding to payment:", error)
  //     setIsLoading(false)
  //   }
  // }

  const handleCashfreeFlow = async () => {
    try {
      // Step 1: Load Cashfree SDK
      if (!window.Cashfree) {
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.async = true;
        script.onload = () => {
          console.log("Cashfree SDK loaded");
        };
        document.body.appendChild(script);
  
        await new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (window.Cashfree) {
              clearInterval(interval);
              resolve(true);
            }
          }, 100);
          setTimeout(() => reject("Cashfree SDK load timeout"), 5000);
        });
      }
  
      // Step 2: Create order and get session ID
      const uniqueOrderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: uniqueOrderId,
          order_amount: workshopData.price,
          customer_id: String(studentData.id || "anon"), // ✅ Force string
          customer_phone: studentData.phone || "9999999999",
          batchId: selectedBatch.id,
          workshopId: workshopData.id,
        }),
      });
      
  
      const data = await res.json();
  
      if (!data.success || !data.data?.payment_session_id) {
        throw new Error(data.message || "Session creation failed");
      }
  
      // Step 3: Launch checkout
      const cashfree = window.Cashfree({ mode: "sandbox" });
      await cashfree.checkout({
        paymentSessionId: data.data.payment_session_id,
        redirectTarget: "_self",
      });
  
    } catch (err) {
      console.error("Cashfree init failed", err);
      alert("Payment gateway failed to load. Try again.");
    }
  };
  

  // Format the workshop title to match the design
  const formatTitle = (title: string | undefined) => {
    if (!title) return "Workshop" // Return a default value if title is undefined

    if (title.toLowerCase().includes("iace")) {
      return (
        <>
          i<span className="text-[#D40F14]">ACE</span> {title.replace(/iace/i, "").trim()}
        </>
      )
    }
    return title
  }

  // Format student name
  const getStudentName = () => {
    if (studentData.name) return studentData.name
    if (studentData.first_name && studentData.last_name) return `${studentData.first_name} ${studentData.last_name}`
    return "Student"
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch (e) {
      return dateString
    }
  }

  // Check if we have all required data
  if (!studentData || !workshopData || !selectedBatch) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Missing Information</h2>
          <p className="text-red-600 mb-4">Some required information is missing. Please go back and try again.</p>
          <button
            onClick={onCancel}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md max-h-[90vh] relative animate-fadeIn my-8">
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-4rem)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Payment Details</h2>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center mb-4">
            <div className="w-12 h-12 relative rounded-md overflow-hidden mr-3">
              <Image
                src={workshopData.image || "/placeholder.svg?height=64&width=64"}
                alt={workshopData.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-base">{formatTitle(workshopData.title)}</h3>
              <p className="text-sm text-gray-600">
                {workshopData.sessions} Sessions • {workshopData.duration?.split(" ")[0] || "2"} hours per session
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2">Student Information</h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <p className="mb-1">
                <span className="font-medium">Name:</span>
              </p>
              <p className="mb-1 text-right">{getStudentName()}</p>
              <p className="mb-1">
                <span className="font-medium">Email:</span>
              </p>
              <p className="mb-1 text-right">{studentData.email}</p>
              <p>
                <span className="font-medium">Phone:</span>
              </p>
              <p className="text-right">{studentData.phone}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium mb-2">Batch Information</h4>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                <p className="mb-1">
                  <span className="font-medium">Date:</span>
                </p>
                <p className="mb-1 text-right">
                  {formatDate(selectedBatch.start_date)} to {formatDate(selectedBatch.end_date)}
                </p>
                <p className="mb-1">
                  <span className="font-medium">Time:</span>
                </p>
                <p className="mb-1 text-right">
                  {selectedBatch.start_time || "Not specified"} - {selectedBatch.end_time || "Not specified"}
                </p>
                <p className="mb-1">
                  <span className="font-medium">Batch:</span>
                </p>
                <p className="mb-1 text-right">{selectedBatch.batch_name || "Not specified"}</p>
                <p className="mb-1">
                  <span className="font-medium">Instructor:</span>
                </p>
                <p className="mb-1 text-right">{selectedBatch.instructor || "Not specified"}</p>
                <p className="mb-1">
                  <span className="font-medium">Location:</span>
                </p>
                <p className="mb-1 text-right">{selectedBatch.location || "Not specified"}</p>
                <p className="mb-1">
                  <span className="font-medium">Schedule:</span>
                </p>
                <p className="mb-1 text-right">{selectedBatch.schedule || "Not specified"}</p>
                <p>
                  <span className="font-medium">Status:</span>
                </p>
                <p className="text-right">{selectedBatch.status || "Not specified"}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2 py-1">
              <span>Workshop Fee</span>
              <span className="font-bold">₹{workshopData.price}</span>
            </div>
            <div className="flex justify-between mb-2 py-1 text-green-600">
              <span>Discount</span>
              <span>₹0</span>
            </div>
            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg py-1">
              <span>Total Amount</span>
              <span>₹{workshopData.price}</span>
            </div>
          </div>

          <div className="bg-[#FFF5F5] p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-3">Payment Information</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                <span>Secure payment gateway with end-to-end encryption</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                <span>Multiple payment options available (Cards, UPI, Net Banking)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                <span>You'll receive a confirmation email after successful payment</span>
              </li>
            </ul>
          </div>




          <div className="mt-6">
            <button
              onClick={handleCashfreeFlow}
              disabled={isLoading}
              className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5 inline" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </button>

            <div className="mt-3 text-center text-xs text-gray-500">Secure payment powered by Cashfree</div>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WorkshopSelector from "./workshop-selector";
import BatchSelector from "./batch-selector";
import PaymentConfirmation from "./payment-confirmation";
import PaymentGateway from "./payment-gateway";

interface RegisteredStudentFlowProps {
  studentData: any;
  initialWorkshopId?: string;
  initialBatchId?: string;
}

export default function RegisteredStudentFlow({
  studentData,
  initialWorkshopId,
  initialBatchId,
}: RegisteredStudentFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<
    "workshop" | "batch" | "payment" | "processing"
  >("workshop");
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Fetch workshops on component mount
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/workshops");
        if (!response.ok) {
          throw new Error("Failed to fetch workshops");
        }
        const data = await response.json();
        setWorkshops(data.workshops || []);

        // If initialWorkshopId is provided, select that workshop
        if (initialWorkshopId && data.workshops) {
          const workshop = data.workshops.find(
            (w: { id: { toString: () => string; }; }) => w.id.toString() === initialWorkshopId
          );
          if (workshop) {
            setSelectedWorkshop(workshop);
            setStep("batch");

            // If initialBatchId is provided, select that batch
            if (initialBatchId && workshop.batches) {
              const batch = workshop.batches.find(
                (b: { id: { toString: () => string; }; }) => b.id.toString() === initialBatchId
              );
              if (batch) {
                setSelectedBatch(batch);
                setStep("payment");
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching workshops:", error);
        setError("Failed to load workshops. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshops();
  }, [initialWorkshopId, initialBatchId]);

  // Handle workshop selection
  const handleWorkshopSelect = (workshop: any) => {
    setSelectedWorkshop(workshop);
    setStep("batch");
  };

  // Handle batch selection
  const handleBatchSelect = (batch: any) => {
    setSelectedBatch(batch);
    setStep("payment");
  };

  // Handle back button
  const handleBack = () => {
    if (step === "batch") {
      setStep("workshop");
    } else if (step === "payment") {
      setStep("batch");
    }
  };

  // Handle proceed to payment
  const handleProceedToPayment = async () => {
    try {
      // Generate order ID
      const newOrderId = `STEI-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;
      setOrderId(newOrderId);

      // Create enrollment record
      const response = await fetch("/api/enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentData.id,
          workshopId: selectedWorkshop.id,
          batchId: selectedBatch.id,
          orderId: newOrderId,
          amount: selectedWorkshop.price,
          paymentStatus: "pending",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create enrollment");
      }

      // Open payment gateway
      setIsPaymentOpen(true);
    } catch (error) {
      console.error("Error proceeding to payment:", error);
      setError("Failed to process payment. Please try again.");
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async (
    transactionId: string,
    paymentDetails: any
  ) => {
    try {
      // Update enrollment with payment details
      const response = await fetch(`/api/enrollment/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId,
          paymentStatus: "completed",
          paymentDetails,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update enrollment");
      }

      // Redirect to confirmation page
      router.push(
        `/booking/confirmation?orderId=${orderId}&transactionId=${transactionId}`
      );
    } catch (error) {
      console.error("Error updating payment details:", error);
      setError(
        "Payment was successful but we couldn't update your enrollment. Please contact support."
      );
    }
  };

  // Handle payment cancel
  const handlePaymentCancel = () => {
    setIsPaymentOpen(false);
  };

  // Show loading state
  if (isLoading && step === "workshop") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D40F14]"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Info Banner */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="font-medium">
          Welcome back,{" "}
          <span className="text-blue-700">{studentData.name}</span>!
        </p>
        <p className="text-sm text-gray-600">
          {studentData.email} | {studentData.phone}
        </p>
      </div>

      {/* Workshop Selection */}
      {step === "workshop" && (
        <WorkshopSelector
          workshops={workshops}
          onSelect={handleWorkshopSelect}
        />
      )}

      {/* Batch Selection */}
      {step === "batch" && selectedWorkshop && (
        <BatchSelector
          workshop={selectedWorkshop}
          onSelect={handleBatchSelect}
          onBack={handleBack}
          studentData={studentData}
        />
      )}

      {/* Payment Confirmation */}
      {step === "payment" && selectedWorkshop && selectedBatch && (
        <PaymentConfirmation
          studentData={studentData}
          workshopData={selectedWorkshop}
          batchData={selectedBatch}
          onBack={handleBack}
          onProceed={handleProceedToPayment}
        />
      )}

      {/* Payment Gateway */}
      {isPaymentOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>
              <PaymentGateway
                amount={selectedWorkshop?.price}
                orderId={orderId}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
                studentName={studentData?.name}
                email={studentData?.email}
                phone={studentData?.phone}
                batchId={selectedBatch.id}
                workshopId={selectedWorkshop.id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

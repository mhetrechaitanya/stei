"use client";

import { useState, useEffect } from "react";
import VerificationModal from "./verification-modal";
import CalendarBatchSelector from "@/app/components/calendar-batch-selector";
import PaymentDetails from "./payment-details";
import PaymentGateway from "@/app/components/payment-gateway";
import { useRouter } from "next/navigation";

interface ClientWrapperProps {
  workshop: any;
}

export default function ClientWrapper({ workshop }: ClientWrapperProps) {
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isBatchSelectorOpen, setIsBatchSelectorOpen] = useState(false);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  console.log("client wrapper data : ", workshop);

  // Handle continue to payment button click
  useEffect(() => {
    const continueBtn = document.getElementById("continue-to-payment-btn");
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        setIsVerificationModalOpen(true);
      });
    }

    return () => {
      if (continueBtn) {
        continueBtn.removeEventListener("click", () => {
          setIsVerificationModalOpen(true);
        });
      }
    };
  }, []);

  // Handle verification success
  const handleVerificationSuccess = (student: any) => {
    console.log("Verification successful, student data:", student);
    setStudentData(student);
    setIsVerificationModalOpen(false);

    // Generate a unique order ID
    const newOrderId = `ORDER_${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}`;
    setOrderId(newOrderId);

    // Show batch selection calendar
    setTimeout(() => {
      setIsBatchSelectorOpen(true);
    }, 300);
  };

  // Handle batch selection
  const handleBatchSelected = (batch: any) => {
    console.log("Batch selected:", batch);
    setSelectedBatch(batch);
  };

  // Handle batch selection complete
  const handleBatchSelectionComplete = (batch: any) => {
    console.log("Batch selection completed with:", batch);
    setSelectedBatch(batch);
    setIsBatchSelectorOpen(false);

    // Show payment details
    setTimeout(() => {
      setIsPaymentDetailsOpen(true);
    }, 300);
  };

  // Handle proceed to payment
  const handleProceedToPayment = () => {
    console.log("Proceeding to payment");
    setIsPaymentDetailsOpen(false);

    // Show payment gateway
    setTimeout(() => {
      setIsPaymentGatewayOpen(true);
    }, 300);
  };

  // Handle payment success
  const handlePaymentSuccess = (transactionId: string, paymentDetails: any) => {
    console.log("Payment successful:", transactionId, paymentDetails);

    console.log(
      `&student_id=${studentData?.id}` +
        `&workshop_id=${workshop?.id}` +
        `&batch_id=${selectedBatch?.id}` +
        `&amount=${workshop?.price}` +
        `&transaction_id=${transactionId}`
    );

    // Redirect to confirmation page
    router.push(
      `/booking/confirmation?order_id=${orderId}` +
        `&student_id=${studentData?.id}` +
        `&workshop_id=${workshop?.id}` +
        `&batch_id=${selectedBatch?.id}` +
        `&amount=${workshop?.price}` +
        `&transaction_id=${transactionId}`
    );
  };

  // Handle payment cancel
  const handlePaymentCancel = () => {
    setIsPaymentGatewayOpen(false);
    setIsPaymentDetailsOpen(true);
  };

  console.log(
    "testing calendar batch selector , data in client - wrapper : ",
    workshop
  );

  return (
    <>
      {/* Verification Modal */}
      {isVerificationModalOpen && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          onVerificationSuccess={handleVerificationSuccess}
        />
      )}

      {/* Batch Selection Calendar */}
      {isBatchSelectorOpen && workshop && Array.isArray(workshop.batches) && (
        <CalendarBatchSelector
          isOpen={isBatchSelectorOpen}
          onClose={() => setIsBatchSelectorOpen(false)}
          workshop={workshop}
          onBatchSelected={handleBatchSelected}
          onContinue={handleBatchSelectionComplete}
          student_id= {studentData.id || ""}
        />
      )}

      {/* Payment Details */}
      {isPaymentDetailsOpen && studentData && workshop && selectedBatch && (
        <PaymentDetails
          studentData={studentData}
          workshopData={workshop}
          selectedBatch={selectedBatch}
          onCancel={() => setIsPaymentDetailsOpen(false)}
          onProceed={handleProceedToPayment}
          orderId={orderId}
        />
      )}

      {/* Payment Gateway */}
      {isPaymentGatewayOpen && (
        <PaymentGateway
          amount={workshop?.price || 0}
          orderId={orderId}
          studentName={
            studentData?.name ||
            `${studentData?.first_name || ""} ${
              studentData?.last_name || ""
            }`.trim()
          }
          studentId={studentData.id || ""}
          email={studentData?.email || ""}
          phone={studentData?.phone || ""}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
          batchId={selectedBatch?.id}
          workshopId={workshop.id}  
        />
      )}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import VerificationModal from "./verification-modal";
import CalendarBatchSelector from "@/app/components/calendar-batch-selector";
import PaymentDetails from "./payment-details";
import PaymentGateway from "@/app/components/payment-gateway";
import { useRouter } from "next/navigation";
import EnrollModal from "./enroll-modal";
import WorkshopDetailsClient from "./workshop-details-client";

interface ClientWrapperProps {
  workshop: any;
}

export default function ClientWrapper({ workshop }: ClientWrapperProps) {
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isBatchSelectorOpen, setIsBatchSelectorOpen] = useState(false);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
  const [isNoBatchesModalOpen, setIsNoBatchesModalOpen] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  console.log("client wrapper data : ", workshop);
  console.log("Modal states:", { 
    isVerificationModalOpen, 
    isEnrollModalOpen, 
    isBatchSelectorOpen, 
    isPaymentDetailsOpen, 
    isPaymentGatewayOpen,
    isNoBatchesModalOpen
  });

  // Wrapper function to track verification modal opening
  const openVerificationModal = (reason: string) => {
    console.log("Opening verification modal. Reason:", reason);
    console.log("Current modal states before opening:", { isVerificationModalOpen, isEnrollModalOpen });
    setIsVerificationModalOpen(true);
  };

  // Wrapper function to track enroll modal opening
  const openEnrollModal = (reason: string) => {
    console.log("Opening enroll modal. Reason:", reason);
    console.log("Current modal states before opening:", { isVerificationModalOpen, isEnrollModalOpen });
    setIsEnrollModalOpen(true);
  };

  // Handle continue to payment button click
  useEffect(() => {
    console.log("Setting up event listeners");
    
    const continueBtn = document.getElementById("continue-to-payment-btn");
    const continueHandler = () => {
      console.log("Continue to payment clicked");
      openVerificationModal("continue-to-payment-btn");
    };
    
    if (continueBtn) {
      continueBtn.addEventListener("click", continueHandler);
      console.log("Added event listener to continue-to-payment-btn");
    } else {
      console.log("continue-to-payment-btn not found");
    }
    
    // Re-add enroll-now-btn event listener logic
    const enrollBtns = document.getElementsByClassName("enroll-now-btn");
    console.log("Found enroll buttons:", enrollBtns.length);
    
    const enrollHandler = () => {
      console.log("Enroll now clicked via event listener");
      openEnrollModal("enroll-now-btn");
    };
    
    for (let i = 0; i < enrollBtns.length; i++) {
      enrollBtns[i].addEventListener("click", enrollHandler);
      console.log(`Added event listener to enroll button ${i}`);
    }
    
    return () => {
      console.log("Cleaning up event listeners");
      if (continueBtn) {
        continueBtn.removeEventListener("click", continueHandler);
      }
      for (let i = 0; i < enrollBtns.length; i++) {
        enrollBtns[i].removeEventListener("click", enrollHandler);
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

    // Check if batches are available
    const hasBatches = workshop && Array.isArray(workshop.batches) && workshop.batches.length > 0;
    console.log("Checking batches availability:", { hasBatches, batches: workshop?.batches });

    if (hasBatches) {
      // Show batch selection calendar
      setTimeout(() => {
        setIsBatchSelectorOpen(true);
      }, 300);
    } else {
      // Show "workshop will start soon" modal
      setTimeout(() => {
        setIsNoBatchesModalOpen(true);
      }, 300);
    }
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
    // Only open PaymentDetails if both IDs are present
    if (!studentData || !studentData.id || !batch || !batch.id) {
      alert("Missing student or batch information. Please try again.");
      console.error("Missing studentData.id or batch.id", { studentData, batch });
      return;
    }
    console.log("Opening PaymentDetails with:", { studentId: studentData.id, batchId: batch.id });
    setIsBatchSelectorOpen(false);
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
      {/* Enroll Modal */}
      {isEnrollModalOpen && (
        <EnrollModal
          isOpen={isEnrollModalOpen}
          onClose={() => {
            console.log("EnrollModal onClose called");
            setIsEnrollModalOpen(false);
          }}
          onAlreadyRegistered={() => {
            console.log("EnrollModal onAlreadyRegistered called");
            setIsEnrollModalOpen(false);
            setTimeout(() => {
              openVerificationModal("already-registered");
            }, 300);
          }}
        />
      )}
      {/* Verification Modal - only show if EnrollModal is not open */}
      {isVerificationModalOpen && !isEnrollModalOpen && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => {
            console.log("VerificationModal onClose called");
            setIsVerificationModalOpen(false);
          }}
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
          student_id={String(studentData?.id || "")}
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
          studentId={String(studentData?.id || "")}
          email={studentData?.email || ""}
          phone={studentData?.phone || ""}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
          batchId={String(selectedBatch?.id || "")}
          workshopId={String(workshop?.id || "")}  
        />
      )}

      {/* No Batches Available Modal */}
      {isNoBatchesModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-fadeIn">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Workshop Will Start Soon!
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                We're currently preparing the batches for this workshop. New batches will be announced soon. Please check back later or explore other available workshops.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsNoBatchesModalOpen(false);
                    router.push('/workshops');
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Return to Workshops
                </button>
                <button
                  onClick={() => setIsNoBatchesModalOpen(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Stay on This Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

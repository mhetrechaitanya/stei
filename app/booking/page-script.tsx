"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PaymentGateway from "../components/payment-gateway";

export default function BookingPageScript() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id : "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    dob: "",
    education: "",
    occupation: "",
    organization: "",
    experience: "",
    expectations: "",
    referral: "",
    affiliate: "",
    workshopId: "",
    batchId: "",
  });
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState(4999);
  const [orderId, setOrderId] = useState("");

  // Initialize form data from hidden fields
  useEffect(() => {
    const workshopIdField = document.getElementById(
      "workshopId"
    ) as HTMLInputElement;
    const batchIdField = document.getElementById("batchId") as HTMLInputElement;
    const amountField = document.getElementById("amount") as HTMLInputElement;

    if (workshopIdField) {
      setFormData((prev) => ({ ...prev, workshopId: workshopIdField.value }));
    }

    if (batchIdField) {
      setFormData((prev) => ({ ...prev, batchId: batchIdField.value }));
    }

    if (amountField && amountField.value) {
      setAmount(Number(amountField.value));
    }
  }, []);

  const handlePaymentSuccess = async (transactionId: string | Blob, orderDetails: any) => {
    try {
      setIsSubmitting(true);

      // Create form data to submit
      const submitData = new FormData();

      // Add all form fields to the FormData
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      // Add payment details
      submitData.append("transactionId", transactionId);
      submitData.append("orderId", orderId);
      submitData.append("paymentStatus", "paid");
      submitData.append("paymentDetails", JSON.stringify(orderDetails));
      submitData.append("amount", amount.toString());

      // Submit the form data to the API
      const response = await fetch("/api/booking", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit booking");
      }

      // Redirect to confirmation page
      router.push("/booking/confirmation");
    } catch (error) {
      console.error("Error processing booking after payment:", error);
      alert(
        "Payment was successful, but there was an issue completing your booking. Please contact support with your transaction ID: " +
          transactionId
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  // We're not using the form submission handler anymore as it's handled by DirectPaymentHandlerComponent

  if (showPayment) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
            <PaymentGateway
              amount={amount}
              studentName={formData.name}
            studentId={formData.id}
              email={formData.email}
              phone={formData.phone}
              orderId={orderId}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
              batchId={formData.batchId}
              workshopId={formData.workshopId}            
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// components/PaymentGateway.tsx
"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, CreditCard, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { number } from "framer-motion";
// import { load } from "@cashfreepayments/cashfree-js";

declare global {
  interface Window {
    Cashfree?: any;
  }
}

interface PaymentGatewayProps {
  amount: number;
  orderId: string;
  studentId?: string;
  studentName?: string;
  email?: string;
  phone?: string;
  batchId?: string;
  workshopId?: string;
  onSuccess: (transactionId: string, paymentDetails: any) => void;
  onCancel: () => void;
}

function sanitizeCustomerId(input: string) {
  return input.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function generateUniqueOrderId(base: string) {
  return `${base}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export default function PaymentGateway({
  amount,
  orderId,
  studentId = "",
  studentName = "",
  email = "",
  phone = "",
  batchId = "",
  workshopId = "",
  onSuccess,
  onCancel,
}: PaymentGatewayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "success" | "failed"
  >("pending");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("UPI");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );
  const router = useRouter();
  const [paymentSessionId, setPaymentSessionId] = useState("");
  const [sdkLoaded, setSdkLoaded] = useState(false);


  console.log("PaymentGateway batch id Payment Gateway ",batchId);
  console.log("PaymentGateway workshopid Payment Gateway",workshopId);studentId
  console.log("PaymentGateway studentId Payment Gateway",studentId);


  // Check for payment confirmation from return URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdFromUrl = urlParams.get("order_id");

    console.log("URL Parameters:", urlParams.toString());

    if (orderIdFromUrl) {
      // Verify payment status with backend
      verifyPaymentStatus(orderIdFromUrl);
    } else if (orderId) {
      // If there's no URL parameters but we have an orderId from props,
      // just initialize the component for new payment
      setIsLoading(false);
    } else {
      console.error("No order information found");
      setError("Missing order information. Please contact support.");
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    console.log("Loading Cashfree SDK... use effect");

    // if (window.Cashfree) {
    //   setSdkLoaded(true);
    //   return;
    // }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    console.log("Loading Cashfree SDK...", script);
    script.async = true;
    script.onload = () => {
      // Poll for window.Cashfree to be available
      const checkInterval = setInterval(() => {
        if (window.Cashfree) {
          setSdkLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      // Optionally, after 5 seconds, stop polling and show error
      setTimeout(() => clearInterval(checkInterval), 5000);
    };
    document.body.appendChild(script);
  }, []);

  // Show a notification for a few seconds
  const displayNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  // Verify payment status with backend after Cashfree redirect
  const verifyPaymentStatus = async (orderIdFromUrl: string) => {
    setIsLoading(true);
    setPaymentStatus("processing");
    console.log("Verifying payment for order:", orderIdFromUrl);
    try {
      console.log("Verifying payment for order:", orderIdFromUrl);
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderIdFromUrl,
        }),
      });

      const data = await response.json();
      console.log("Payment verification response:", data);

      if (!response.ok) {
        throw new Error(
          `Payment verification failed: ${data.message || response.statusText}`
        );
      }

      if (data.success) {
        // Consider any of these statuses as successful payment
        const successStatuses = ["PAID", "SUCCESS", "CAPTURED", "COMPLETED"];
        if (successStatuses.includes(data.payment_status)) {
          setPaymentStatus("success");
          setPaymentDetails(data);

          // Include the order ID in the payment details
          const paymentInfo = {
            ...data,
            orderId: orderIdFromUrl,
          };

          onSuccess(data.cf_payment_id || data.transaction_id, paymentInfo);
          displayNotification("Payment successful!", "success");
        } else {
          setPaymentStatus("failed");
          setError(
            `Payment ${
              data.payment_status
                ? data.payment_status.toLowerCase()
                : "verification"
            } failed. Please try again.`
          );
          displayNotification("Payment failed!", "error");
        }
      } else {
        setPaymentStatus("failed");
        setError(data.message || "Payment verification failed");
        displayNotification("Payment verification failed!", "error");
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      setPaymentStatus("failed");
      setError("Failed to verify payment status. Please try again.");
      displayNotification("Payment verification error!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Load Cashfree SDK in sandbox mode
  // const initializeSDK = async () => {
  //   console.log("Initializing Cashfree SDK2...");
  //   if (typeof window !== "undefined" && window.Cashfree) {
  //     console.log("Initializing Cashfree SDK.3 if ..");
  //     return window.Cashfree;
  //   }
  //   throw new Error("Cashfree SDK not loaded");
  // };

  // Load Cashfree SDK in sandbox mode
  const initializeSDK = async () => {
    console.log("Initializing Cashfree SDK...");
    if (typeof window !== "undefined" && window.Cashfree) {
      const cashfree = window.Cashfree({
        mode: "sandbox",
      });
      console.log("Cashfree SDK initialized in sandbox mode.");
      return cashfree;
    }
    throw new Error("Cashfree SDK not loaded");
  };

  // Initiate Cashfree payment process
  // const initiatePayment = async (sessionId: string) => {
  //   try {
  //     console.log(sessionId);
  //     const cashfree = await initializeSDK();
  //     const checkoutOptions = {
  //       paymentSessionId: sessionId,
  //       redirectTarget: "_self",
  //     };
  //     console.log("Starting checkout with options:", checkoutOptions);
  //     setIsLoading(true);
  //     console.log("Initializing Cashfree SDK 1");
  //     cashfree.checkout(checkoutOptions);
  //   } catch (err) {
  //     setError("Failed to load payment gateway. Please try again.");
  //   }
  // };

  const initiatePayment = async (sessionId: string) => {
    try {
      console.log("Initializing Cashfree Checkout...");
      const cashfree = window.Cashfree({
        mode: "sandbox",
      });

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_self",
      };

      console.log("Starting checkout with options:", checkoutOptions);
      setIsLoading(true);
      cashfree.checkout(checkoutOptions);
    } catch (err) {
      console.error("Error during Cashfree checkout initialization:", err);
      setError("Failed to load payment gateway. Please try again.");
      displayNotification(
        "Failed to load payment gateway. Please try again.",
        "error"
      );
    }
  };

  // Process payment with Cashfree (overrides previous logic)
  const processCashfreePayment = async () => {
    if (!sdkLoaded) {
      setError(
        "Payment gateway is still loading. Please wait a moment and try again."
      );
      return;
    }
    // if (!selectedMethod) {
    //   setError("Please select a payment method");
    //   return;
    // }
    setIsLoading(true);
    setError("");

    try {
      const customer_id = String(studentId);
      const uniqueOrderId = generateUniqueOrderId(orderId);

      // Create order via API
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: uniqueOrderId,
          order_amount: amount,
          customer_id,
          customer_phone: phone || "9999999999",
          batchId,            // ✅ Required
          workshopId,         // ✅ Required
        }),
      });
      const data = await response.json();
      console.log(data);
      if (!data.success || !data.data?.payment_session_id) {
        throw new Error(
          data.message || "Failed to initiate payment. Please try again."
        );
      }

      setPaymentSessionId(data.data.payment_session_id);
      await initiatePayment(data?.data?.payment_session_id);
    } catch (error: any) {
      console.error("Cashfree payment error:", error);
      const errorMessage =
        error.message || "Payment processing failed. Please try again.";
      setError(`Payment Error: ${errorMessage}`);
      displayNotification(`Payment failed: ${errorMessage}, "error"`);
    } finally {
      setIsLoading(false);
    }
  };

  // Notification component
  const renderNotification = () => {
    if (!showNotification) return null;

    return (
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs transition-all duration-300 ease-in-out ${
          notificationType === "success"
            ? "bg-green-100 border-l-4 border-green-500"
            : "bg-red-100 border-l-4 border-red-500"
        }`}
      >
        <div
          className={`rounded-full p-1 ${
            notificationType === "success" ? "bg-green-200" : "bg-red-200"
          }`}
        >
          {notificationType === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          )}
        </div>
        <div>
          <p
            className={`text-sm font-medium ${
              notificationType === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {notificationMessage}
          </p>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setShowNotification(false)}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  };

  // Render success state
  const renderSuccessState = () => (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="rounded-full bg-green-100 p-3 mb-3">
        <CheckCircle2 className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-base font-bold text-green-600 mb-2">
        Payment Successful
      </h3>
      <p className="text-gray-600 mb-4 text-sm text-center max-w-xs">
        Your payment of ₹{amount.toFixed(2)} has been processed successfully.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 w-full mb-4">
        <h4 className="text-sm font-semibold mb-2">Transaction Details</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-medium">
              {paymentDetails?.cf_payment_id ||
                paymentDetails?.transaction_id ||
                "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">
              {paymentDetails?.payment_method || selectedMethod || "Online"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-[#B00D11] transition-colors text-sm"
      >
        Go to Dashboard
      </button>
    </div>
  );

  // Card container for the entire payment gateway
  return (
    <>
      {renderNotification()}
      <div
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-md mx-auto"
        data-testid="payment-gateway"
      >
        {/* Card Header */}
        <div className="bg-[#D40F14] text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Payment Gateway</h2>
            <CreditCard className="h-6 w-6" />
          </div>
        </div>
  
        {/* Card Content */}
        <div className="p-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-[#D40F14]" />
              <p className="mt-3 text-sm font-medium">
                {paymentStatus === "processing"
                  ? "Verifying payment..."
                  : "Processing payment..."}
              </p>
            </div>
          ) : paymentStatus === "success" ? (
            renderSuccessState()
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-red-100 p-3 mb-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-red-600 mb-2">
                Payment Error
              </h3>
              <p className="text-gray-600 mb-4 text-sm text-center max-w-xs">
                {error}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setError("");
                    setIsLoading(false);
                  }}
                  className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-[#B00D11] transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Payment Summary */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-base font-bold mb-3">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Workshop:</span>
                    <span className="font-medium">STEI Workshop</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{orderId}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="text-gray-800 font-semibold">Amount:</span>
                    <span className="font-bold text-[#D40F14] text-lg">
                      ₹{amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
  
              {/* Redirecting Notice */}
              <div className="text-sm text-gray-500 text-center pt-4">
                Redirecting to secure payment page...
              </div>
  
              {/* Payment Security Note */}
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 pt-3">
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8H12.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>All payments are secured and encrypted</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )  
}
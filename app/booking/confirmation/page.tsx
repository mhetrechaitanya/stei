"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, Loader2, ArrowLeft } from "lucide-react";

// Component that uses useSearchParams - wrapped in Suspense
function ConfirmationContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (!orderId) {
      setError("Missing order ID from Cashfree.");
      setIsLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        const result = await response.json();
        console.log("Payment verification response:", result);
        console.log("Payment verification response status:", result.batch);

        if (!response.ok || !result.success) {
          setError(result.message || "Payment verification failed.");
        } else {
          setOrderDetails(result);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("Something went wrong during verification.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-[#D40F14] mb-4" />
        <p className="text-lg font-medium">Verifying your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto my-12 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Verification Failed
          </h1>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
        <div className="flex justify-between pt-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return Home
          </button>
          <button
            onClick={() => router.push("/contact")}
            className="px-4 py-2 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11]"
          >
            Contact Support
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-12 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 text-center">
          Thank you for your payment. Your workshop registration is confirmed.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Receipt</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium">
                {orderDetails?.order_id ?? "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-medium">
                {orderDetails?.transaction_id ?? "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">
                {orderDetails?.payment_method?.app?.provider || "Online"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Paid On</span>
              <span className="font-medium">
                {orderDetails?.transaction_time
                  ? new Date(orderDetails.transaction_time).toLocaleString()
                  : new Date().toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="font-semibold text-gray-800">Amount Paid</span>
              <span className="font-bold text-[#D40F14] text-lg">
                ₹
                {typeof orderDetails?.amount === "number" ||
                typeof orderDetails?.amount === "string"
                  ? orderDetails.amount
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-blue-800 font-semibold mb-2">Next Steps</h3>
          <p className="text-blue-700 text-sm">
            You'll soon receive a confirmation email with your workshop schedule
            and access details. Stay tuned!
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return Home
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function ConfirmationPageFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-[#D40F14] mb-4" />
      <p className="text-lg font-medium">Loading confirmation page...</p>
    </div>
  );
}

// Main component that wraps ConfirmationContent in Suspense
export default function ConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationPageFallback />}>
      <ConfirmationContent />
    </Suspense>
  );
}
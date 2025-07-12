"use client";

import { useState } from "react";
import { X, CheckCircle2, Calendar, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface BatchInfo {
  date?: string;
  time?: string;
  location?: string;
  batch_name?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  zoom_id?: string;
  zoom_link?: string;
  zoom_password?: string;
}

interface PaymentPopupSuccessStyleProps {
  orderId: string;
  amount: number;
  batch: BatchInfo;
  studentId: string;
  workshopId: string;
  batchId: string;
  onClose: () => void;
}

export default function PaymentPopupSuccessStyle({
  orderId,
  amount,
  batch,
  studentId,
  workshopId,
  batchId,
  onClose,
}: PaymentPopupSuccessStyleProps) {
  const [paid, setPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: String(studentId),
          workshopId: String(workshopId),
          batchId: String(batchId),
          orderId,
          amount,
          paymentStatus: "completed",
          transactionId: `txn_${Date.now()}`, // dummy for now
        }),
      });

      const data = await response.json();
      if (!data.success) {
        alert("Error: " + data.message);
        return;
      }

      setPaid(true);
    } catch (err) {
      console.error("Payment error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toISOString().slice(0, 10).replace(/-/g, "/");
  }

  function formatTime(timeStr?: string) {
    if (!timeStr) return "";
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr.slice(0, 5);
    return timeStr;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md max-h-[80vh] relative animate-fadeIn my-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {!paid ? (
          <div className="p-4 overflow-y-auto max-h-[calc(80vh-3rem)]">
            <h2 className="text-xl font-bold mb-4 text-center">Complete Enrollment</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderId}</span>
              </div>
              {batch.batch_name && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Batch:</span>
                  <span className="font-medium">{batch.batch_name}</span>
                </div>
              )}
              {(batch.start_date || batch.date) && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center"><Calendar className="h-4 w-4 mr-1 text-[#D40F14]" />Date:</span>
                  <span className="font-medium">
                    {formatDate(batch.start_date || batch.date)}
                    {batch.end_date ? ` - ${formatDate(batch.end_date)}` : ""}
                  </span>
                </div>
              )}
              {(batch.start_time || batch.time) && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center"><Clock className="h-4 w-4 mr-1 text-[#D40F14]" />Time:</span>
                  <span className="font-medium">
                    {formatTime(batch.start_time || batch.time)}
                    {batch.end_time ? ` - ${formatTime(batch.end_time)}` : ""}
                  </span>
                </div>
              )}
              {/* {batch.location && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center"><MapPin className="h-4 w-4 mr-1 text-[#D40F14]" />Location:</span>
                  <span className="font-medium">{batch.location}</span>
                </div>
              )} */}
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-bold">Total Amount:</span>
                <span className="font-bold text-[#D40F14]">₹{amount.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-70 flex items-center justify-center"
            >
              {isProcessing ? "Processing..." : amount === 0 ? "Enroll for Free" : `Pay ₹${amount.toFixed(2)}`}
            </button>
            <div className="mt-4 text-center text-sm text-gray-500">
              {amount === 0 ? "No payment required for this course." : "Secure payment powered by Cashfree"}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg w-full p-6 relative">
            <div className="flex flex-col items-center mb-8 mt-4">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Enrolled Successfully!
              </h1>
              <p className="text-gray-600 text-center">
                You have successfully enrolled in the workshop!
              </p>
            </div>
            <div className="flex justify-center pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

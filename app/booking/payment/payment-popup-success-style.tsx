"use client";

import { useState } from "react";
import { X, CheckCircle2, Calendar, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface BatchInfo {
  date?: string;
  time?: string;
  location?: string;
  batch_name?: string;
}

interface PaymentPopupSuccessStyleProps {
  orderId: string;
  amount: number;
  batch: BatchInfo;
  onClose: () => void;
}

export default function PaymentPopupSuccessStyle({
  orderId,
  amount,
  batch,
  onClose,
}: PaymentPopupSuccessStyleProps) {
  const [paid, setPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate payment delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setPaid(true);
    setIsProcessing(false);
  };

  if (paid) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative animate-fadeIn">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
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
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11]"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
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
            {batch.date && (
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center"><Calendar className="h-4 w-4 mr-1 text-[#D40F14]" />Date:</span>
                <span className="font-medium">{batch.date}</span>
              </div>
            )}
            {batch.time && (
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center"><Clock className="h-4 w-4 mr-1 text-[#D40F14]" />Time:</span>
                <span className="font-medium">{batch.time}</span>
              </div>
            )}
            {batch.location && (
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center"><MapPin className="h-4 w-4 mr-1 text-[#D40F14]" />Location:</span>
                <span className="font-medium">{batch.location}</span>
              </div>
            )}
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
          <div className="mt-4 text-center text-sm text-gray-500">{amount === 0 ? "No payment required for this course." : "Secure payment powered by Cashfree"}</div>
        </div>
      </div>
    </div>
  );
} 
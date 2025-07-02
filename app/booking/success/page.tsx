"use client";

import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  return (
    <div className="max-w-lg mx-auto my-12 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col items-center mb-8">
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
      <div className="flex justify-between pt-4">
        {/* <button
          onClick={() => router.push("/")}
          className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return Home
        </button> */}
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11]"
        >
          Return Home
        </button>
      </div>
    </div>
  );
} 
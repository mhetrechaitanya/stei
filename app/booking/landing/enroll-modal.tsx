"use client"

import { X, Users, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface EnrollModalProps {
  isOpen: boolean
  onClose: () => void
  onAlreadyRegistered: () => void;
}

export default function EnrollModal({ isOpen, onClose, onAlreadyRegistered }: EnrollModalProps) {
  console.log("EnrollModal rendered, isOpen:", isOpen);
  const router = useRouter();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative animate-fadeIn">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">How would you like to proceed?</h2>
          <div className="space-y-6">
            <button
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg mb-2"
              onClick={() => router.push('/student-registration')}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              New Registration
            </button>
            <button
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              onClick={onAlreadyRegistered}
            >
              <Users className="w-5 h-5 mr-2" />
              Already Registered
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
"use client";
import { useRouter } from "next/navigation";
import WorkshopDetailsClient from "./workshop-details-client";
import { CheckCircle, Users } from "lucide-react";
import { useState } from "react";
import VerificationModal from "./verification-modal";
import EnrollModal from "./enroll-modal";

export default function ClientLanding({ workshops }: { workshops: any[] }) {
  const router = useRouter();
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const workshop = workshops[0];

  // Handler for Enroll Now buttons
  const handleOpenEnrollModal = () => setIsEnrollModalOpen(true);

  // Handler for Already Registered in EnrollModal
  const handleAlreadyRegistered = () => {
    setIsEnrollModalOpen(false);
    setTimeout(() => setIsVerificationModalOpen(true), 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                Workshop Details
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            {/* Pass handler to WorkshopDetailsClient for Enroll Now buttons */}
            <WorkshopDetailsClient workshop={workshop} onEnrollNow={handleOpenEnrollModal} />

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {/* New Registration */}
              <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 border border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">New Registration</h3>
                  <p className="mb-8 text-slate-600 leading-relaxed">
                    If you're new to our platform, register here to book a workshop and start your learning journey
                  </p>
                  <button
                    className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={handleOpenEnrollModal}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Register Now
                  </button>
                </div>
              </div>

              {/* Already Registered */}
              <div className="group bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-8 border border-red-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">Already Registered</h3>
                  <p className="mb-8 text-slate-600 leading-relaxed">
                    If you've already registered with us, use this option to book a workshop slot and continue learning
                  </p>
                  <button
                    className="inline-flex items-center justify-center w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={() => setIsVerificationModalOpen(true)}
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enroll Now Modal */}
        <EnrollModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          onAlreadyRegistered={handleAlreadyRegistered}
        />
        {/* Verification Modal */}
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          onVerificationSuccess={() => setIsVerificationModalOpen(false)}
        />
      </div>
    </div>
  );
} 
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Users, Star, X } from "lucide-react";
import VerificationModal from "./verification-modal";
// REMOVE: import EnrollModal from "./enroll-modal";

interface Mentor {
  id?: string;
  name?: string;
  title?: string;
  bio?: string;
  image?: string;
  email?: string;
}

interface WorkshopBatch {
  id?: string;
  batch_name?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  slots?: number;
  enrolled?: number;
}

interface Workshop {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  batches?: WorkshopBatch[];
  mentor?: Mentor;
  testimonials?: any[];
}

export default function WorkshopDetailsClient({ workshop }: { workshop: Workshop }) {
  // REMOVE: const [showEnrollModal, setShowEnrollModal] = useState(false);
  // REMOVE: const handleEnrollNow = ...
  // REMOVE: const handleCloseModal = ...
  // REMOVE: useEffect for scroll lock

  // Helper to format date as DD/MM/YYYY
  function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB");
  }
  // Helper to format time as HH:mm
  function formatTime(timeStr?: string) {
    if (!timeStr) return "";
    // If already in HH:mm, return as is
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
    // If in HH:mm:ss, trim seconds
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr.slice(0,5);
    return timeStr;
  }

  // Handle enrollment - this will be handled by ClientWrapper's event listeners
  const handleEnrollNow = () => {
    // Do nothing - let the ClientWrapper handle the click via event listeners
    console.log("Enroll now button clicked in WorkshopDetailsClient");
  };

  // Debug: Log workshop data to see what's actually loaded
  console.log('Workshop data loaded:', workshop);
  console.log('Workshop duration_value:', (workshop as any).duration_value);
  console.log('Workshop duration_unit:', (workshop as any).duration_unit);
  console.log('Workshop minutes_per_session:', (workshop as any).minutes_per_session);
  console.log('Workshop sessions_per_day:', (workshop as any).sessions_per_day);

  // Use the actual database fields
  const totalDays = (workshop as any).duration_value || 1;
  const sessionsPerDay = (workshop as any).sessions_per_day || 1;
  const sessionDurationMinutes = (workshop as any).minutes_per_session || 120;
  
  // Calculate total sessions based on duration and sessions per day
  const totalSessions = totalDays * sessionsPerDay;

  if (!workshop) {
    return (
      <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-xl shadow-sm">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-amber-800 font-medium">Workshop details are not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 space-y-8">
      {/* Background Image Header */}
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center mb-8">
        <div className="absolute inset-0 z-0">
          <Image
            src={workshop.image || "/placeholder.svg?height=400&width=800"}
            
            alt={workshop.title || "Workshop Image"}
            fill
            className="object-cover object-center w-full h-full rounded-b-3xl opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/10 rounded-b-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-4">
          <Link href="/workshops" className="mb-4 inline-block px-4 py-2 rounded-full bg-black/40 text-white text-sm font-medium hover:bg-black/60 transition-colors">
            ← Back to Workshops
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
            Register for <span className="text-blue-300">{workshop.title || "Workshop"}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto">
            Join our expert-led workshop and enhance your skills with hands-on learning
          </p>
        </div>
      </div>
      {/* About Workshop */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">About Workshop</h3>
        </div>
        <div className="text-slate-600 text-lg leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: workshop.description || "<p>No description available.</p>" }} />
      </div>

      {/* Workshop Schedule & Details Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Workshop Schedule & Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Duration - Shows total days */}
          <div className="bg-white rounded-xl p-6 border border-indigo-200 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-[#D40F14] rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Total Duration</p>
                <p className="text-gray-600">
                  {totalDays} day{(totalDays > 1 ? 's' : '')}
                </p>
              </div>
            </div>
          </div>

          {/* Total Sessions */}
          <div className="bg-white rounded-xl p-6 border border-indigo-200 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-[#D40F14] rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Total Sessions</p>
                <p className="text-gray-600">
                  {totalSessions} session{totalSessions > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Session Duration */}
          <div className="bg-white rounded-xl p-6 border border-indigo-200 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-[#D40F14] rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Session Duration</p>
                <p className="text-gray-600">
                  {sessionDurationMinutes} minutes
                </p>
              </div>
            </div>
          </div>

          {/* Sessions per Day */}
          <div className="bg-white rounded-xl p-6 border border-indigo-200 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-[#D40F14] rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Sessions per Day</p>
                <p className="text-gray-600">
                  {sessionsPerDay} session{(sessionsPerDay > 1 ? 's' : '')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Workshop Info */}
        <div className="mt-8 pt-6 border-t border-indigo-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-indigo-200 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Batch Capacity</p>
                  <p className="text-gray-600">
                    Maximum {(workshop as any).capacity || 15} participants per batch
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-indigo-200 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Workshop Format</p>
                  <p className="text-gray-600">
                    Interactive live sessions with hands-on practice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 {/* Enroll Now Call-to-Action Section */}
 <div className="my-10 flex justify-center">
        <div className="w-full max-w-4x2 bg-gradient-to-r from-[#D40F14] via-[#B00D11] to-[#D40F14] rounded-2xl shadow-xl px-6 py-4 flex flex-col md:flex-row items-center md:items-center text-white border-4 border-[#fff] relative overflow-hidden">
          <div className="absolute -top-8 -left-8 opacity-20 text-[120px] pointer-events-none select-none">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex-1 flex flex-col md:flex-row items-center gap-4 md:gap-8 z-10 w-full">
            <h2 className="text-2xl md:text-2xl font-extrabold drop-shadow-lg whitespace-nowrap">Ready to Enroll?</h2>
            <p className="text-base md:text-lg font-medium opacity-90 mb-0 text-center md:text-left flex-1">Secure your spot in this workshop and start your learning journey today!</p>
            <button
              className="enroll-now-btn bg-white text-[#D40F14] hover:bg-gray-100 font-bold px-6 py-3 rounded-xl text-lg shadow-lg transition-all duration-200 border-2 border-[#D40F14] hover:scale-105 whitespace-nowrap"
              onClick={handleEnrollNow}
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
      {/* About Mentor */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200 shadow-sm">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">About Mentor</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Image */}
          <div className="md:w-1/3">
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={workshop.mentor?.image || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1573993472182%20%281%29.jpg-OVm1fWafCW2a4vffSUJCXikiuvnhme.jpeg"}
                alt={workshop.mentor?.name || "Workshop Mentor"}
                fill
                className="object-cover"
              />
            </div>
          </div>
          {/* Right side - Information */}
          <div className="md:w-2/3">
            <h4 className="text-3xl font-bold text-slate-800 mb-6">
              About {workshop.mentor?.name || "Our Expert Mentor"}
            </h4>
            <div className="space-y-4 text-slate-700">
              {workshop.mentor?.bio ? (
                <p className="text-lg leading-relaxed">
                  {workshop.mentor.bio}
                </p>
              ) : (
                <>
                  <p className="text-lg leading-relaxed mt-4">
                    Sandhya Tewari is an academician, teacher, trainer, and NLP coach. Dr. Tewari has dedicated her career to empowering individuals, whether students, professionals, or corporate leaders. She has designed transformative workshops focused on self-awareness, communication, and professional growth. Her expertise in soft skills training, behavioural assessments, and coaching methodologies bridges the gap between academia and the corporate world.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="my-10 flex justify-center">
        <div className="w-full max-w-4x2 bg-gradient-to-r from-[#D40F14] via-[#B00D11] to-[#D40F14] rounded-2xl shadow-xl px-6 py-4 flex flex-col md:flex-row items-center md:items-center text-white border-4 border-[#fff] relative overflow-hidden">
          <div className="absolute -top-8 -left-8 opacity-20 text-[120px] pointer-events-none select-none">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex-1 flex flex-col md:flex-row items-center gap-4 md:gap-8 z-10 w-full">
            <h2 className="text-2xl md:text-2xl font-extrabold drop-shadow-lg whitespace-nowrap">Ready to Enroll?</h2>
            <p className="text-base md:text-lg font-medium opacity-90 mb-0 text-center md:text-left flex-1">Secure your spot in this workshop and start your learning journey today!</p>
            <button
              className="enroll-now-btn bg-white text-[#D40F14] hover:bg-gray-100 font-bold px-6 py-3 rounded-xl text-lg shadow-lg transition-all duration-200 border-2 border-[#D40F14] hover:scale-105 whitespace-nowrap"
              onClick={handleEnrollNow}
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
      {/* Batch Information */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Available Batches</h3>
        </div>
        {workshop.batches && workshop.batches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workshop.batches.map((batch, index) => {
              const slotsLeft = typeof batch.slots === "number" && typeof batch.enrolled === "number"
                ? batch.slots - batch.enrolled
                : "Limited";
              // Format date and time ranges
              const dateRange = batch.start_date && batch.end_date
                ? `${formatDate(batch.start_date)} - ${formatDate(batch.end_date)}`
                : batch.start_date
                  ? formatDate(batch.start_date)
                  : "Date TBD";
              const timeRange = batch.start_time && batch.end_time
                ? `${formatTime(batch.start_time)} - ${formatTime(batch.end_time)}`
                : batch.start_time
                  ? formatTime(batch.start_time)
                  : "Time TBD";
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-slate-800 text-lg">{batch.batch_name}</h4>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Batch {index + 1}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="w-4 h-4 mr-2 text-green-500" />
                      <span>{dateRange}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Clock className="w-4 h-4 mr-2 text-green-500" />
                      <span>{timeRange}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-red-600 font-bold text-lg">
                        {slotsLeft}
                      </span>
                      <span className="text-slate-600 ml-1">slots left</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 border border-dashed border-green-300 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-slate-500 text-lg">No batches available at the moment.</p>
            <p className="text-slate-400 text-sm mt-2">Check back soon for new batch announcements!</p>
          </div>
        )}
      </div>

      {/* Testimonials */}
      {workshop.testimonials && workshop.testimonials.length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
              <Star className="w-6 h-6 text-white fill-current" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Feedback from Previous Participants</h3>
          </div>
          <div className="bg-white rounded-xl p-6 border-l-4 border-orange-400 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-slate-700 italic text-lg leading-relaxed mb-3">
                  "{workshop.testimonials[0].text}"
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {workshop.testimonials[0].name?.charAt(0) || "A"}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800">{workshop.testimonials[0].name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Now Modal */}
      {/* REMOVE: Enroll Now Modal rendering here */}
    </div>
  );
}
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Users, Star, CheckCircle } from "lucide-react";
import { getWorkshops } from "@/lib/data-service";
// Import the error boundary wrapper
import ErrorBoundaryWrapper from "@/app/components/error-boundary-wrapper";

// Import the new client component
import ClientWrapper from "./client-wrapper";

export function WorkshopDetails({ workshop }) {
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
        <p className="text-slate-600 text-lg leading-relaxed">
          {workshop.description || "No description available."}
        </p>
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
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1573993472182%20%281%29.jpg-OVm1fWafCW2a4vffSUJCXikiuvnhme.jpeg"
                alt="Dr. Sandhya Tewari"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right side - Information */}
          <div className="md:w-2/3">
            <h4 className="text-3xl font-bold text-slate-800 mb-6">About Dr. Sandhya Tewari</h4>

            <div className="space-y-4 text-slate-700">
              <p className="text-lg leading-relaxed">
                Dr. Sandhya Tewari is a seasoned professional with over 30 years of experience in education, human
                resources, and personal development. A PhD holder in Management from PAHER University, Udaipur, and a
                Diploma recipient in Business Information from Alexander College, Perth, she brings a global
                perspective to career and skill development.
              </p>

              <p className="text-lg leading-relaxed">
                As an academician, teacher, trainer, and NLP coach, Dr. Tewari has dedicated her career to empowering
                individuals—whether students, professionals, or corporate leaders. She has designed transformative
                workshops focused on self-awareness, communication, and professional growth. Her expertise in soft
                skills training, behavioural assessments, and coaching methodologies bridges the gap between academia
                and the corporate world.
              </p>

              <p className="text-lg leading-relaxed">
                Beyond teaching, she has authored research papers, presented at international conferences, and
                pioneered initiatives that enhance employability and leadership skills. Her research paper,
                "Aspirations & Wants of Generation Z – A Study on the Workforce of the Future," presented at the
                International Conference on Technology & Business Management (CFD Dubai, 2017), won the Outstanding
                Paper Award.
              </p>

              <p className="text-lg leading-relaxed">
                As the founder of stei, Dr. Tewari's mission is simple: to equip individuals with the confidence,
                skills, and clarity they need to thrive in their careers and lives. With a holistic, results-driven
                approach, she continues to shape the future of personal and professional development.
              </p>
            </div>
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
              console.log(batch); // Log each batch object
              const slotsLeft = typeof batch.slots === "number" && typeof batch.enrolled === "number"
                ? batch.slots - batch.enrolled
                : "Limited";
              
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
                      <span>{batch.start_date || "Date TBD"}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Clock className="w-4 h-4 mr-2 text-green-500" />
                      <span>{batch.start_time || "Time TBD"}</span>
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
    </div>
  );
}

export default async function BookingLandingPage({
  searchParams,
}: {
  searchParams: { workshopId?: string; batchId?: string };
}) {
  const workshopId = searchParams?.workshopId || "1";
  const batchId = searchParams?.batchId || "1";

  // Fetch workshop data with error handling
  let workshops = [];
  let error = null;

  try {
    const result = await getWorkshops();
    workshops = result.data || [];
    error = result.error;
  } catch (err) {
    console.error("Error fetching workshops:", err);
    error = "Failed to fetch workshop data";
  }

  // Handle errors
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Unable to load workshop data
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            We're experiencing technical difficulties. Please try again later.
          </p>
          <Link
            href="/workshops"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-red-600 hover:to-red-700 hover:shadow-xl transform hover:scale-105"
          >
            Return to Workshops
          </Link>
        </div>
      </div>
    );
  }

  // Handle case where no workshops are found
  if (!workshops || workshops.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-slate-800">No Workshops Available</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            There are currently no workshops available for registration.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-slate-700 hover:to-slate-800 hover:shadow-xl transform hover:scale-105"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Find the selected workshop or use the first one
  const selectedWorkshop =
    workshops.find((w) => w.id.toString() === workshopId.toString()) ||
    workshops[0];

  // Ensure we have a valid workshop
  if (!selectedWorkshop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-orange-200">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 17H9v-2l1.586-1.586a2 2 0 012.828 0L15 15v2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            Workshop Not Found
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            The requested workshop could not be found.
          </p>
          <Link
            href="/workshops"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-orange-600 hover:to-red-600 hover:shadow-xl transform hover:scale-105"
          >
            Browse Workshops
          </Link>
        </div>
      </div>
    );
  }

  // Sanitize the workshop data for security
  const sanitizedWorkshop = {
    id: selectedWorkshop.id,
    title: selectedWorkshop.title || "Workshop",
    description: selectedWorkshop.description || "No description available",
    price:
      typeof selectedWorkshop.fee === "number" ? selectedWorkshop.fee : 0,
    image: "/placeholder.svg?height=400&width=600",
    batches: Array.isArray(selectedWorkshop.batches)
      ? selectedWorkshop.batches
      : [],
    mentor: selectedWorkshop.mentor || {
      name: "Expert Mentor",
      title: "Industry Professional",
    },
    testimonials: Array.isArray(selectedWorkshop.testimonials)
      ? selectedWorkshop.testimonials
      : [],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <Image
          src="/placeholder.svg?height=400&width=600"
          alt="Workshop Registration"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-4xl">
            <Link
              href="/workshops"
              className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-all duration-200 hover:translate-x-1 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Workshops
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Register for{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {sanitizedWorkshop.title}
              </span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl">
              Join our expert-led workshop and enhance your skills with hands-on learning
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                Workshop Registration
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            {/* Workshop Info - Wrapped in ErrorBoundary */}
            <ErrorBoundaryWrapper>
              <WorkshopDetails workshop={sanitizedWorkshop} />
            </ErrorBoundaryWrapper>

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
                  <Link
                    href={`/student-registration`}
                    className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Register Now
                  </Link>
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
                    id="continue-to-payment-btn"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client-side only booking flow */}
      <ClientWrapper workshop={sanitizedWorkshop} />
    </div>
  );
}
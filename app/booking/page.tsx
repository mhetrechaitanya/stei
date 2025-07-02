import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Users, CheckCircle, ArrowLeft, Award } from "lucide-react"
import { getWorkshops } from "@/lib/data-service"
import { DirectPaymentHandlerComponent } from "./direct-payment-handler"
import { getSupabaseServer } from "@/lib/supabase-server"
import BookingClient from "./booking-client"

export default async function BookingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract parameters from URL
  const workshopId = typeof searchParams.workshopId === "string" ? searchParams.workshopId : undefined
  const batchId = typeof searchParams.batchId === "string" ? searchParams.batchId : undefined
  const workshopTitle = typeof searchParams.title === "string" ? searchParams.title : undefined
  const workshopPrice = typeof searchParams.price === "string" ? Number.parseInt(searchParams.price) : undefined

  // Add this code to pre-fill the form if we have a studentId
  let studentData = null
  const studentId = typeof searchParams.studentId === "string" ? searchParams.studentId : ""
  if (studentId) {
    try {
      // Fetch student data if we have a studentId
      const { data: student, error } = await getSupabaseServer()
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single()

      if (!error && student) {
        studentData = student
      }
    } catch (error) {
      console.error("Error fetching student data:", error)
    }
  }

  // Fetch workshop data
  const { data: workshops, error } = await getWorkshops()

  // Add error logging
  if (error) {
    console.error("Error fetching workshops:", error)
  }

  // Provide a fallback workshop object if none is found
  const selectedWorkshop = workshops?.find((w) => w.id.toString() === workshopId?.toString()) ||
    workshops?.[0] || {
      id: "1",
      title: "Workshop",
      description: "Workshop description",
      image: "/placeholder.svg?height=400&width=800",
      sessions: 4,
      duration: "2 hours per session",
      capacity: 15,
      price: 4999,
      upcoming: [],
    }

  // Find the selected batch
  const selectedBatch =
    selectedWorkshop?.upcoming?.find((b) => b.id.toString() === batchId?.toString()) ||
    (selectedWorkshop?.upcoming && selectedWorkshop.upcoming.length > 0 ? selectedWorkshop.upcoming[0] : null)

  // Default image URL if workshop image is not available
  const defaultImageUrl = "/placeholder.svg?height=400&width=800"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Simplified */}
      <div className="relative h-[200px]">
        <Image
          src={selectedWorkshop?.image || defaultImageUrl}
          alt="Workshop Registration"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <Link
              href="/workshops"
              className="inline-flex items-center text-white/80 hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Workshops
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Register for {selectedWorkshop?.title || "Workshop"}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workshop Summary Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
              <div className="relative h-48">
                <Image
                  src={selectedWorkshop?.image || defaultImageUrl}
                  alt={selectedWorkshop?.title || "Workshop"}
                  fill
                  className="object-cover"
                />
                {selectedWorkshop?.featured && (
                  <div className="absolute top-0 left-0 bg-[#D40F14] text-white px-3 py-1 rounded-br-lg font-bold">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{selectedWorkshop?.title || "Workshop"}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {selectedWorkshop?.description || "Join our transformative workshop to enhance your skills."}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-[#D40F14] mr-2" />
                    <p>{selectedWorkshop?.sessions || 4} Sessions</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-[#D40F14] mr-2" />
                    <p>{selectedWorkshop?.duration || "2 hours per session"}</p>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-[#D40F14] mr-2" />
                    <p>Limited to {selectedWorkshop?.capacity || 15} participants</p>
                  </div>
                </div>

                {selectedBatch && (
                  <div className="bg-[#FFF5F5] p-4 rounded-lg mb-4">
                    <h3 className="font-bold mb-2">Selected Batch</h3>
                    <p className="font-medium">{selectedBatch.date}</p>
                    <p className="text-sm text-gray-700">{selectedBatch.time}</p>
                    <p className="text-sm mt-2">
                      <span className="font-medium text-[#D40F14]">{selectedBatch.slots - selectedBatch.enrolled}</span>{" "}
                      slots left
                    </p>
                  </div>
                )}

                <div className="bg-[#FFF5F5] p-4 rounded-lg">
                  <p className="font-bold text-xl text-[#D40F14] mb-1">₹{selectedWorkshop?.price || 4999}</p>
                  <p className="text-gray-600 text-sm">Inclusive of all materials</p>
                </div>
              </div>
            </div>

            {/* Coach Mini Profile */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6 p-4">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full overflow-hidden relative">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Dr. Salman Ahmad"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold">Dr. Salman Ahmad</h3>
                  <p className="text-sm text-gray-600">Founder, STEI</p>
                  <div className="flex items-center mt-1">
                    <Award className="h-4 w-4 text-[#D40F14] mr-1" />
                    <p className="text-xs">15+ years experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Mini */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6 p-4">
              <h3 className="font-bold mb-3">What Participants Say</h3>
              <div className="italic text-gray-700 text-sm">
                "After three failed interviews at tech giants, I enrolled in Dr. Ahmad's workshop. His techniques
                completely transformed my approach. Two weeks after completing the program, I received offers from both
                Google and Microsoft!"
              </div>
              <div className="flex items-center mt-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden relative">
                  <Image src="/placeholder.svg?height=32&width=32" alt="Priya Sharma" fill className="object-cover" />
                </div>
                <div className="ml-2">
                  <p className="text-xs font-bold">Priya Sharma</p>
                  <p className="text-xs text-gray-600">Software Engineer at Google</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form Column - Replicated from Admin Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Student Registration</h2>

              {/* Hidden fields for workshop and batch */}
              <input type="hidden" id="workshopId" name="workshopId" value={workshopId} />
              <input type="hidden" id="batchId" name="batchId" value={batchId} />
              <input type="hidden" id="amount" name="amount" value={selectedWorkshop?.price || 4999} />

              {/* Personal Information Form - Replicated from Admin Panel */}
              <form id="bookingForm" className="space-y-6">
                <h3 className="text-lg font-bold mb-4 text-gray-700">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your Full Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder=""
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    placeholder="Your full address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Your City"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      placeholder="Your State"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      placeholder="110001"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-4 text-gray-700 pt-4">Professional Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                      Highest Education
                    </label>
                    <select
                      id="education"
                      name="education"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                    >
                      <option value="">Select Education</option>
                      <option value="high_school">High School</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="phd">PhD</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Occupation
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      name="occupation"
                      placeholder="Your current job or role"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization/Company
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      placeholder="Where you work or study"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      id="experience"
                      name="experience"
                      min="0"
                      max="50"
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-4 text-gray-700 pt-4">Workshop Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="workshop" className="block text-sm font-medium text-gray-700 mb-1">
                      Selected Workshop
                    </label>
                    <input
                      type="text"
                      id="workshop"
                      name="workshop"
                      value={selectedWorkshop?.title || "Workshop"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent bg-gray-50"
                      disabled
                    />
                  </div>

                  <div>
                    <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">
                      Selected Batch
                    </label>
                    <input
                      type="text"
                      id="batch"
                      name="batch"
                      value={selectedBatch ? `${selectedBatch.date} (${selectedBatch.time})` : "Default Batch"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent bg-gray-50"
                      disabled
                    />
                  </div>

                  <div>
                    <label htmlFor="amount-display" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      id="amount-display"
                      name="amount-display"
                      value={selectedWorkshop?.price || 4999}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent bg-gray-50"
                      disabled
                    />
                  </div>

                  <div>
                    <label htmlFor="affiliate" className="block text-sm font-medium text-gray-700 mb-1">
                      Affiliate/Referral Code
                    </label>
                    <input
                      type="text"
                      id="affiliate"
                      name="affiliate"
                      placeholder="If you have a referral code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-4 text-gray-700 pt-4">Additional Information</h3>

                <div>
                  <label htmlFor="expectations" className="block text-sm font-medium text-gray-700 mb-1">
                    What do you expect to learn from this workshop?
                  </label>
                  <textarea
                    id="expectations"
                    name="expectations"
                    rows={3}
                    placeholder="Your expectations from this workshop"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="referral" className="block text-sm font-medium text-gray-700 mb-1">
                    How did you hear about us?
                  </label>
                  <select
                    id="referral"
                    name="referral"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:border-transparent"
                  >
                    <option value="">Select an option</option>
                    <option value="social_media">Social Media</option>
                    <option value="friend">Friend or Colleague</option>
                    <option value="search">Search Engine</option>
                    <option value="email">Email</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-[#D40F14]"
                      required
                    />
                  </div>
                  <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="text-[#D40F14] hover:underline">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#D40F14] hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Information */}
            <div className="mt-8 bg-[#FFF5F5] rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Important Information</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Secure online payment is required to confirm your booking.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                  <span>We accept all major credit/debit cards, UPI, and net banking.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                  <span>You will receive a confirmation email with workshop details after successful payment.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    For any queries, please contact us at{" "}
                    <a href="mailto:support@stei.pro" className="text-[#D40F14] hover:underline">
                      support@stei.pro
                    </a>{" "}
                    or call{" "}
                    <a href="tel:+919876543210" className="text-[#D40F14] hover:underline">
                      +91 98765 43210
                    </a>
                    .
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <DirectPaymentHandlerComponent />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">New Student?</h2>
              <p className="mb-4">If you haven't registered with us before, please register first.</p>
              <a
                href="/student-registration"
                className="inline-block bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
              >
                Register as New Student
              </a>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Already Registered?</h2>
              <p className="mb-4">If you've already registered with us, continue with your booking.</p>
              <button
                data-action="existing-user"
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Continue as Registered Student
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Client component for handling verification, batch selection, and payment */}
      <BookingClient
        workshopId={workshopId}
        batchId={batchId}
        workshopTitle={workshopTitle}
        workshopPrice={workshopPrice}
      />
    </div>
  )
}

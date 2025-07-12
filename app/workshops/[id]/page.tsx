import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Users, CheckCircle, ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import { getWorkshopById } from "@/lib/workshop-service"

export default async function WorkshopDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { data: workshop, error } = await getWorkshopById(id)

  if (error || !workshop) {
    notFound()
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[300px] md:h-[400px]">
          <Image
            src={workshop.image || "/placeholder.svg?height=400&width=1200"}
            alt={workshop.name || "Workshop"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
            <div className="max-w-3xl">
              <Link
                href="/workshops"
                className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Workshops
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {workshop.name || "Workshop"}
              </h1>
              <div className="w-20 h-1 bg-[#D40F14] mb-6" />
              <p className="text-lg text-white/90 max-w-2xl">
                {workshop.short_description || workshop.description || "Join our interactive workshop"}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* About Workshop */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">About This Workshop</h2>
                <div className="prose max-w-none">
                  <p>{workshop.description}</p>

                  {workshop.curriculum && (
                    <>
                      <h3 className="text-xl font-bold mt-6 mb-4">What You'll Learn</h3>
                      <ul className="space-y-2">
                        {Array.isArray(workshop.curriculum) ? (
                          workshop.curriculum.map((item: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                            <span>{workshop.curriculum}</span>
                          </li>
                        )}
                      </ul>
                    </>
                  )}
                </div>
              </div>

              {/* Workshop Schedule & Details Section */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">Workshop Schedule & Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Duration */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#D40F14] rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Total Duration</p>
                      <p className="text-gray-600">
                        {workshop.duration_value && workshop.duration_unit 
                          ? `${workshop.duration_value} ${workshop.duration_unit}` 
                          : "2 hours per session"}
                      </p>
                    </div>
                  </div>

                  {/* Sessions */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#D40F14] rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Total Sessions</p>
                      <p className="text-gray-600">
                        {workshop.sessions_per_day || 4} sessions
                      </p>
                    </div>
                  </div>

                  {/* Minutes per Session */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#D40F14] rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Session Duration</p>
                      <p className="text-gray-600">
                        {workshop.minutes_per_session 
                          ? `${workshop.minutes_per_session} minutes` 
                          : "120 minutes"}
                      </p>
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#D40F14] rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Start Date</p>
                      <p className="text-gray-600">
                        {workshop.start_date 
                          ? new Date(workshop.start_date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })
                          : "To be announced"}
                      </p>
                    </div>
                  </div>

                  {/* Session Start Time */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#D40F14] rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Session Time</p>
                      <p className="text-gray-600">
                        {workshop.session_start_time || "10:00 AM"}
                      </p>
                    </div>
                  </div>

                  {/* Sessions per Day */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#D40F14] rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Sessions per Day</p>
                      <p className="text-gray-600">
                        {workshop.sessions_per_day || "1 session"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Workshop Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Batch Capacity</p>
                        <p className="text-gray-600">
                          Maximum {workshop.capacity || 15} participants per batch
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
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

              {/* Enroll Now Section */}
              <div className="bg-gradient-to-r from-[#D40F14] to-[#B00D11] rounded-xl shadow-lg p-8 mb-8 text-white">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Skills?</h2>
                  <p className="text-lg mb-6 text-white/90">
                    Join hundreds of professionals who have already enhanced their careers through our workshops
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <div className="flex items-center text-white/90">
                      <Users className="h-5 w-5 mr-2" />
                      <span>Limited seats available</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Certificate provided</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>Interactive sessions</span>
                    </div>
                  </div>
                  <Link
                    href={`/booking/landing?workshopId=${params.id}`}
                    className="inline-flex items-center bg-white text-[#D40F14] font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 text-lg"
                  >
                    <Calendar className="mr-2 h-6 w-6" />
                    Enroll Now - Book Your Slot
                  </Link>
                  <p className="text-sm text-white/80 mt-4">
                    Price: ₹{workshop.fee || 0} | {workshop.capacity || 15} seats per batch
                  </p>
                </div>
              </div>

              {/* About Mentor */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">About the Mentor</h2>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-32 h-32 relative rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={workshop.mentor?.image || "/placeholder.svg?height=128&width=128"}
                      alt={workshop.mentor?.name || "Mentor"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{workshop.mentor?.name || "Expert Mentor"}</h3>
                    <p className="text-[#D40F14] font-medium mb-4">
                      {workshop.mentor?.title || "Industry Professional"}
                    </p>
                    <div className="prose max-w-none">
                      <p>
                        {workshop.mentor?.bio ||
                          "Our expert mentor brings years of industry experience to help you master new skills and advance your career."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials/Feedback */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">What Participants Say</h2>

                {workshop.testimonials && workshop.testimonials.length > 0 ? (
                  <div className="space-y-6">
                    {workshop.testimonials.map((testimonial: any, index: number) => (
                      <div key={index} className="border-l-4 border-[#D40F14] pl-4 py-2">
                        <p className="italic mb-2">{testimonial.text}</p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
                            <Image
                              src={testimonial.image || "/placeholder.svg?height=40&width=40"}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold">{testimonial.name}</p>
                            <p className="text-sm text-gray-600">{testimonial.title}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Be the first to attend this workshop and share your experience!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Workshop Details */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 sticky top-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-4">Workshop Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-[#D40F14] mr-3" />
                      <div>
                        <p className="font-medium">Duration</p>
                        <p className="text-gray-600">
                          {workshop.sessions_r || 1} sessions, {workshop.duration_v && workshop.duration_u ? `${workshop.duration_v} ${workshop.duration_u}` : "2 hours"} each
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-[#D40F14] mr-3" />
                      <div>
                        <p className="font-medium">Schedule</p>
                        <p className="text-gray-600">Multiple batches available</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-[#D40F14] mr-3" />
                      <div>
                        <p className="font-medium">Participants</p>
                        <p className="text-gray-600">Limited to {workshop.capacity || 20} per batch</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-4">Upcoming Batches</h3>
                  {workshop.batches && workshop.batches.length > 0 ? (
                    <div className="space-y-3">
                      {workshop.batches.map((batch: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                          <div className="font-medium">
                            {batch.start_date && batch.end_date
                              ? `${new Date(batch.start_date).toLocaleDateString('en-GB')} - ${new Date(batch.end_date).toLocaleDateString('en-GB')}`
                              : batch.date
                                ? new Date(batch.date).toLocaleDateString('en-GB')
                                : 'Date TBD'}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">{batch.time}</div>
                          <div className="text-sm">
                            <span className="font-medium text-[#D40F14]">
                              {(batch.slots || 0) - (batch.enrolled || 0)}
                            </span>{' '}
                            slots left
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No upcoming batches scheduled</p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold">Price:</span>
                    <span className="text-2xl font-bold text-[#D40F14]">₹{workshop.fee || 0}</span>
                  </div>
                  {workshop.original_price && workshop.original_price > workshop.fee && (
                    <div className="text-right">
                      <span className="text-gray-500 line-through">₹{workshop.original_price}</span>
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {Math.round(((workshop.original_price - workshop.fee) / workshop.original_price) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Replace the Registration Options section with Book Slot button */}
                <div className="mb-6">
                  <Link
                    href={`/booking/landing?workshopId=${params.id}`}
                    className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Slot
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

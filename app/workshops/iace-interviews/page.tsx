import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Users, CheckCircle, Award, BookOpen, ArrowRight } from "lucide-react"
import Footer from "@/app/components/footer"
import IACEText from "@/app/components/iace-text"

export default function IACEInterviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px]">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Interview-mvBLBc80AiuspNNDwl3KTe0RtDZXtw.jpeg"
          alt="iACE Interviews Workshop"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <span className="inline-block bg-[#D40F14] text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
              Flagship Workshop
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              <IACEText /> Series
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Master the art of acing interviews with confidence and professional presentation skills
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/booking"
                className="bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-3 px-8 rounded-full transition-all duration-300 inline-block text-center"
              >
                Book Your Slot Now
              </Link>
              <Link
                href="/workshops"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
              >
                View All Workshops
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Course Overview */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-2/3">
                <div className="flex items-center mb-6">
                  <div className="bg-[#FFF5F5] p-4 rounded-full mr-4">
                    <Award className="h-8 w-8 text-[#D40F14]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Course Overview</h2>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center text-gray-600 mb-4">
                    <span className="font-medium text-lg">Conducted by</span>
                    <span className="ml-2 text-[#D40F14] font-semibold text-lg">Dr. Sandhya Tewari</span>
                    <span className="ml-2 text-sm text-gray-500">(Life Coach & Mentor)</span>
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    <IACEText /> series is designed to help you ace interviews, improve conversational fluency, and
                    create a lasting impact, transforming confidence into empowerment.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Gain practical tips and insight on addressing FAQs by HR to enhance your chances of success. This
                    workshop combines theory with extensive practice sessions to ensure you're fully prepared for your
                    next interview opportunity.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/booking"
                    className="bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Your Slot
                  </Link>
                  <button className="bg-white border border-[#D40F14] text-[#D40F14] hover:bg-gray-50 font-medium py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center">
                    <Users className="mr-2 h-5 w-5" />
                    Group Booking Inquiry
                  </button>
                </div>
              </div>

              <div className="md:w-1/3 bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Course Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-[#D40F14] mr-3" />
                    <div>
                      <p className="font-medium">Sessions</p>
                      <p className="text-gray-600">4 Interactive Sessions</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-[#D40F14] mr-3" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-gray-600">2 Hours per Session</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-[#D40F14] mr-3" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-gray-600">10-15 Participants</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-[#D40F14] mr-3" />
                    <div>
                      <p className="font-medium">Certificate</p>
                      <p className="text-gray-600">Completion Certificate</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="font-bold text-xl text-[#D40F14]">₹4,999</p>
                    <p className="text-gray-600 text-sm">Inclusive of all materials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-8">
              <div className="bg-[#FFF5F5] p-4 rounded-full mr-4">
                <BookOpen className="h-8 w-8 text-[#D40F14]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">What You'll Learn</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#D40F14] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Understand Employer Expectations</h3>
                  <p className="text-gray-600">
                    Learn what recruiters and hiring managers are really looking for in candidates
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#D40F14] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Master Question Techniques</h3>
                  <p className="text-gray-600">
                    Develop strategies for answering common, behavioral, and situational questions
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#D40F14] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Professional Presentation</h3>
                  <p className="text-gray-600">
                    Learn how to present yourself professionally through verbal and non-verbal communication
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#D40F14] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Mock Interview Practice</h3>
                  <p className="text-gray-600">Participate in realistic mock interviews with personalised feedback</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#D40F14] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Handle Difficult Questions</h3>
                  <p className="text-gray-600">
                    Techniques for addressing challenging questions and turning weaknesses into strengths
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#D40F14] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Salary Negotiation</h3>
                  <p className="text-gray-600">Learn effective strategies for discussing compensation and benefits</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Workshops */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Workshops You Might Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Conversational%20Fluency-xodQf2Uw9RDYUi1uxyoiQYYZmarvoi.jpeg"
                  alt="iACE Spoken Fluency"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  <IACEText /> Conversational Fluency
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Enhance your conversational English skills and build confidence in professional settings.
                </p>
                <Link
                  href="/workshops/iace-conversational-fluency"
                  className="flex items-center text-[#D40F14] font-medium hover:underline"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Individual%20Impact%20copy-K0eqsUG7AnCSBD9TvSY3xAqnixXtbR.jpeg"
                  alt="iACE Individual Impact"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  <IACEText /> Individual Impact
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Develop your personal brand and learn how to make a lasting impression in professional environments.
                </p>
                <Link
                  href="/workshops/iace-individual-impact"
                  className="flex items-center text-[#D40F14] font-medium hover:underline"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Employability-Skills-Yx9Yd9Uw9RDYUi1uxyoiQYYZmarvoi.jpeg"
                  alt="iACE Employability Skills"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  <IACEText /> Employability Skills
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Acquire essential skills that employers value to enhance your career prospects and job readiness.
                </p>
                <Link
                  href="/workshops/iace-employability"
                  className="flex items-center text-[#D40F14] font-medium hover:underline"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

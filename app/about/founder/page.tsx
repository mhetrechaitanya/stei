"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react"

// Update the certificates array with the new certificates and their details
const certificates = [
  {
    id: 1,
    title: "Diploma in NLP",
    issuer: "NLP Coaching Academy",
    date: "February 16, 2021",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dr.%20Sandhya%20Tewari%20-%20Diploma%20in%20NLP_page-0001.jpg-OHdVVJyaLd95v9D01DGCrTgrxPro9J.jpeg",
    certNumber: "#203395",
  },
  {
    id: 2,
    title: "Licensed Emotional Intelligence Coach Practitioner",
    issuer: "NLP Coaching Academy",
    date: "March 27, 2021",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dr.%20Sandhya%20Tewari%20EI_page-0001.jpg-t8DGGxKuEDoRyX0bxnTzZcYoVuHlBa.jpeg",
    certNumber: "#203008",
  },
  {
    id: 3,
    title: "Certified Life Coach",
    issuer: "NLP Coaching Academy",
    date: "March 27, 2021",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dr.%20Sandhya%20Tewari%20-%20Certified%20Life%20Coach_page-0001.jpg-o8n5bV8KFocOpdrNlRsRRptCXe1k6M.jpeg",
    certNumber: "#203397",
  },
  {
    id: 4,
    title: "NLP Associate Practitioner",
    issuer: "NLP Coaching Academy",
    date: "February 16, 2021",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dr.%20Sandhya%20Tewari%20-%20NLP%20Associate%20Practitioner_page-0001.jpg-Bw6OKYQ26K2WJDdhDmEDjCa9bIg69a.jpeg",
    certNumber: "#203394",
  },
  {
    id: 5,
    title: "Certified Associate Leadership and Executive Coach",
    issuer: "NLP Coaching Academy",
    date: "April 4, 2021",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dr.%20Sandhya%20Tewari%20-%20Certified%20Associate%20leadership%20and%20Executive%20Coach_page-0001.jpg-VoSIHisxnyKemvlJrWXsdFfcolGdi8.jpeg",
    certNumber: "#203398",
  },
  {
    id: 6,
    title: "Certified Organizational Development Coach",
    issuer: "NLP Coaching Academy",
    date: "March 1, 2021",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dr.%20Sandhya%20Tewari%20-%20Certified%20Organizational%20Development%20Coach_page-0001.jpg-FtLUrv8TsERGolAfshKiOVsZotoRFk.jpeg",
    certNumber: "#203396",
  },
]

export default function FounderPage() {
  const [showCertificates, setShowCertificates] = useState(false)
  const [currentCertificate, setCurrentCertificate] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [viewMode] = useState<"image">("image")
  const [isLoading, setIsLoading] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)
  const pdfRef = useRef<HTMLIFrameElement>(null)

  // Add a delay function to throttle requests
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const nextCertificate = async () => {
    setRequestError(null)
    setIsLoading(true)
    try {
      // Add delay to prevent too many requests
      await delay(300)
      setCurrentCertificate((prev) => (prev === certificates.length - 1 ? 0 : prev + 1))
      setImageError(false)
    } catch (error) {
      setRequestError("Error loading certificate. Please try again.")
      console.error("Error changing certificate:", error)
    }
  }

  const prevCertificate = async () => {
    setRequestError(null)
    setIsLoading(true)
    try {
      // Add delay to prevent too many requests
      await delay(300)
      setCurrentCertificate((prev) => (prev === 0 ? certificates.length - 1 : prev - 1))
      setImageError(false)
    } catch (error) {
      setRequestError("Error loading certificate. Please try again.")
      console.error("Error changing certificate:", error)
    }
  }

  useEffect(() => {
    // Reset image error state when certificate changes
    setImageError(false)
  }, [currentCertificate])

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // Handle image load event
  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px]">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stei%20backgruond%20image.jpg-2ZUkU6jGTAejvoASeVCI5xEkZqoBah.jpeg"
          alt="Dr. Sandhya Tewari - Founder"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <Link
              href="/about"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to About
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Dr. Sandhya Tewari</h1>
            <p className="text-xl text-white/90 mb-4">Founder & Lead Mentor</p>
            <div className="w-20 h-1 bg-[#D40F14]"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Founder Bio - Only keeping this section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3">
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1573993472182%20%281%29.jpg-OVm1fWafCW2a4vffSUJCXikiuvnhme.jpeg"
                    alt="Dr. Sandhya Tewari"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Certificate Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={async () => {
                      setRequestError(null)
                      setShowCertificates(true)
                      setIsLoading(true)
                      try {
                        await delay(300)
                        setCurrentCertificate(0)
                      } catch (error) {
                        setRequestError("Error loading certificates. Please try again.")
                        console.error("Error loading certificates:", error)
                      }
                    }}
                    className="bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-6 rounded-full transition-all duration-300 flex items-center justify-center w-full"
                  >
                    View Certificates
                  </button>
                </div>
              </div>

              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">About Dr. Sandhya Tewari</h2>

                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Dr. Sandhya Tewari is a seasoned professional with over 30 years of experience in education, human
                  resources, and personal development. A PhD holder in Management from PAHER University, Udaipur, and a
                  Diploma recipient in Business Information from Alexander College, Perth, she brings a global
                  perspective to career and skill development.
                </p>

                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  As an academician, teacher, trainer, and NLP coach, Dr. Tewari has dedicated her career to empowering
                  individuals—whether students, professionals, or corporate leaders. She has designed transformative
                  workshops focused on self-awareness, communication, and professional growth. Her expertise in soft
                  skills training, behavioural assessments, and coaching methodologies bridges the gap between academia
                  and the corporate world.
                </p>

                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Beyond teaching, she has authored research papers, presented at international conferences, and
                  pioneered initiatives that enhance employability and leadership skills. Her research paper,
                  "Aspirations & Wants of Generation Z – A Study on the Workforce of the Future," presented at the
                  International Conference on Technology & Business Management (CFD Dubai, 2017), won the Outstanding
                  Paper Award.
                </p>

                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  As the founder of stei, Dr. Tewari's mission is simple: to equip individuals with the confidence,
                  skills, and clarity they need to thrive in their careers and lives. With a holistic, results-driven
                  approach, she continues to shape the future of personal and professional development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Popup */}
      {showCertificates && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 bg-gray-50 flex justify-between items-center border-b">
              <h3 className="text-xl font-bold text-gray-800">{certificates[currentCertificate]?.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCertificates(false)}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-auto flex-grow">
              {/* Certificate Display */}
              <div className="relative w-full h-[60vh] mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <button
                  onClick={prevCertificate}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 ml-2"
                  aria-label="Previous certificate"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>

                {/* Loading indicator */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D40F14]"></div>
                  </div>
                )}

                {/* Certificate Display */}
                <div className="w-full h-full flex items-center justify-center">
                  {/* Fallback for when images aren't available */}
                  {imageError ? (
                    <div className="flex flex-col items-center justify-center text-center p-8 max-w-lg">
                      <div className="text-3xl font-bold text-gray-800 mb-4">
                        {certificates[currentCertificate]?.title}
                      </div>
                      <div className="text-xl text-gray-600 mb-6">
                        Issued by {certificates[currentCertificate]?.issuer} on {certificates[currentCertificate]?.date}
                        {certificates[currentCertificate]?.certNumber &&
                          ` (${certificates[currentCertificate]?.certNumber})`}
                      </div>
                      <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg mb-6 w-full">
                        <div className="text-gray-500 italic">
                          Certificate{" "}
                          {certificates[currentCertificate]?.certNumber ||
                            (certificates[currentCertificate]?.title?.includes("#")
                              ? certificates[currentCertificate]?.title?.split("#")[1]
                              : "")}
                        </div>
                        <div className="mt-4 text-sm text-gray-400">The certificate image could not be loaded</div>
                      </div>
                    </div>
                  ) : (
                    /* Actual certificate image */
                    <Image
                      src={certificates[currentCertificate]?.imageUrl || "/placeholder.svg"}
                      alt={certificates[currentCertificate]?.title}
                      fill
                      className="object-contain"
                      onLoad={handleImageLoad}
                      onError={() => {
                        setImageError(true)
                        setIsLoading(false)
                      }}
                    />
                  )}
                </div>

                <button
                  onClick={nextCertificate}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 mr-2"
                  aria-label="Next certificate"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
              </div>

              {/* Certificate Info */}
              <div className="text-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800">{certificates[currentCertificate]?.title}</h4>
                <p className="text-gray-600">
                  {certificates[currentCertificate]?.issuer} • {certificates[currentCertificate]?.date}
                  {certificates[currentCertificate]?.certNumber && ` • ${certificates[currentCertificate]?.certNumber}`}
                </p>
              </div>

              {/* Thumbnails */}
              <div className="flex justify-center gap-2 flex-wrap">
                {certificates.map((cert, index) => (
                  <button
                    key={cert.id}
                    onClick={async () => {
                      setRequestError(null)
                      setIsLoading(true)
                      try {
                        await delay(300)
                        setCurrentCertificate(index)
                        setImageError(false)
                      } catch (error) {
                        setRequestError("Error loading certificate. Please try again.")
                        console.error("Error changing certificate:", error)
                      }
                    }}
                    className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                      currentCertificate === index ? "border-[#D40F14] scale-105" : "border-gray-200"
                    }`}
                    aria-label={`View ${cert.title}`}
                    aria-current={currentCertificate === index}
                  >
                    <div className="w-full h-full">
                      <Image
                        src={cert.imageUrl || "/placeholder.svg"}
                        alt={cert.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // If image fails to load, show certificate number
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = cert.title.split("#")[1] || cert.certNumber || ""
                            parent.style.display = "flex"
                            parent.style.alignItems = "center"
                            parent.style.justifyContent = "center"
                            parent.style.backgroundColor = "#f3f4f6"
                            parent.style.fontSize = "0.75rem"
                            parent.style.fontWeight = "500"
                          }
                        }}
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Pagination Indicator */}
              <div className="flex justify-center mt-4">
                <div className="flex gap-1">
                  {certificates.map((_, index) => (
                    <button
                      key={index}
                      onClick={async () => {
                        setRequestError(null)
                        setIsLoading(true)
                        try {
                          // Add delay to prevent too many requests
                          await delay(300)
                          setCurrentCertificate(index)
                          setImageError(false)
                        } catch (error) {
                          setRequestError("Error loading certificate. Please try again.")
                          console.error("Error changing certificate:", error)
                        }
                      }}
                      className={`w-2 h-2 rounded-full ${
                        currentCertificate === index ? "bg-[#D40F14]" : "bg-gray-300"
                      }`}
                      aria-label={`Go to certificate ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Certificate {currentCertificate + 1} of {certificates.length}
              </div>
              <button
                onClick={() => setShowCertificates(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-full transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

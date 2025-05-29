import Link from "next/link"
import { ArrowLeft, Quote } from "lucide-react"
import FallbackImage from "@/app/components/fallback-image"

export default function SalmanRajkotwalaPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/impressions" className="inline-flex items-center text-[#D40F14] hover:underline mb-8 font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Impressions
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
              <div className="flex-shrink-0">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#D40F14]">
                  <FallbackImage
                    src="/images/testimonials/salman-rajkotwala.png"
                    alt="Salman Rajkotwala"
                    width={300}
                    height={300}
                    className="rounded-full object-cover border-4 border-[#D40F14]"
                    priority
                    fallbackSrc="/placeholder.svg?height=300&width=300"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Salman Rajkotwala</h1>
                <p className="text-xl text-[#D40F14] font-medium">Al Wathba Insurance</p>
                <p className="text-gray-600 mt-1">(2011-2013)</p>
              </div>
            </div>

            <div className="relative">
              <Quote className="h-12 w-12 text-[#D40F14]/20 absolute -top-2 -left-2" />
              <div className="space-y-6 pl-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  I had the privilege of being associated with Sandhya Mam between 2011 and 2013, and the impact she had
                  on my life goes far beyond Business Communication. As a mentor, she didn't just teach us the
                  fundamentals of business and management but also transformed my entire personality and vision. Her
                  ability to recognize potential and nurture talent is unparalleled—she truly has a keen eye for
                  discovering and honing skills in people.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  What sets Sandhya Mam apart is her holistic approach to mentorship. Whether it was refining our
                  communication skills, sharpening our leadership abilities, or instilling a deep understanding of
                  business strategies, she equipped us with the tools to excel in every aspect of life. Her passion for
                  empowering students and constantly sharing valuable knowledge makes her an exceptional educator and
                  guide.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  She didn't just teach us; she inspired us to be better versions of ourselves. I am grateful for her
                  mentorship, which continues to influence my personal and professional journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

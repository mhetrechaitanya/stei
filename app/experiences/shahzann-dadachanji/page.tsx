import Link from "next/link"
import { ArrowLeft, Quote } from "lucide-react"
import FallbackImage from "@/app/components/fallback-image"

export default function ShahzannDadachanjiPage() {
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
                    src="/images/testimonials/shahzann-dadachanji.jpeg"
                    alt="Shahzann A Dadachanji"
                    width={300}
                    height={300}
                    className="rounded-full object-cover"
                    priority
                    fallbackSrc="/placeholder.svg?height=300&width=300"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Shahzann A Dadachanji</h1>
                <p className="text-xl text-[#D40F14] font-medium">Entrepreneur & Business Coach</p>
                <p className="text-gray-600 mt-1">(2015-2017)</p>
              </div>
            </div>

            <div className="relative">
              <Quote className="h-12 w-12 text-[#D40F14]/20 absolute -top-2 -left-2" />
              <div className="space-y-6 pl-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  My journey with Sandhya Ma'am began during my MBA studies, where her guidance transformed not just my
                  academic understanding but my entire approach to professional life. What sets her apart is her unique
                  ability to blend theoretical knowledge with practical wisdom, creating a learning experience that goes
                  far beyond textbooks.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Under her mentorship, I developed a deep understanding of business communication that has proven
                  invaluable throughout my career. She taught me that effective communication isn't just about conveying
                  information—it's about connecting with people, understanding perspectives, and building meaningful
                  relationships.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  What I appreciate most about Sandhya Ma'am is her genuine investment in her students' growth. She saw
                  potential in me that I hadn't recognized myself and consistently pushed me to exceed my own
                  expectations. Her belief in my abilities gave me the confidence to pursue entrepreneurship and
                  coaching.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Today, as I guide others in their business journeys, I find myself channeling many of the principles
                  and approaches that Sandhya Ma'am instilled in me. Her impact extends through generations of
                  professionals, creating a lasting legacy of excellence and empowerment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

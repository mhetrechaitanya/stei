import Link from "next/link"
import { ArrowLeft, Quote } from "lucide-react"
import FallbackImage from "@/app/components/fallback-image"

export default function VrindaMenonPage() {
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
                    src="/images/testimonials/vrinda-menon.jpeg"
                    alt="Vrinda Menon"
                    width={300}
                    height={300}
                    className="rounded-full object-cover"
                    priority
                    fallbackSrc="/placeholder.svg?height=300&width=300"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Vrinda Menon</h1>
                <p className="text-xl text-[#D40F14] font-medium">Entrata India Pvt Ltd</p>
                <p className="text-gray-600 mt-1">(2018-2020)</p>
              </div>
            </div>

            <div className="relative">
              <Quote className="h-12 w-12 text-[#D40F14]/20 absolute -top-2 -left-2" />
              <div className="space-y-6 pl-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Working with Sandhya Ma'am was a transformative experience that shaped not only my professional skills
                  but also my personal growth. Her approach to teaching goes beyond conventional methods—she creates an
                  environment where learning becomes an exciting journey of self-discovery.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  What impressed me most was her ability to identify and nurture individual strengths. She recognized my
                  aptitude for strategic thinking and creative problem-solving, encouraging me to develop these skills
                  further. Under her guidance, I gained the confidence to express my ideas boldly and implement
                  innovative solutions in my marketing career.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Sandhya Ma'am's mentorship extends far beyond the classroom. She remains a trusted advisor and source
                  of inspiration even years after our formal teacher-student relationship ended. Her wisdom continues to
                  influence my decision-making and approach to challenges in the ever-evolving marketing landscape.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  I am deeply grateful for her investment in my growth and for showing me that true success comes not
                  just from what you know, but from how you apply that knowledge with integrity and purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

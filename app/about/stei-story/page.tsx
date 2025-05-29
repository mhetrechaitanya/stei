"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import SteiText from "@/app/components/stei-text"

export default function SteiStoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px]">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stei%20backgruond%20image.jpg-2ZUkU6jGTAejvoASeVCI5xEkZqoBah.jpeg"
          alt="The stei Story - Empowering Individuals"
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              The <SteiText /> Story
            </h1>
            <p className="text-xl text-white/90 mb-4">Empowering Individuals</p>
            <div className="w-20 h-1 bg-[#D40F14]"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Journey of Empowerment</h2>

              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  The world is full of potential, but many talented individuals struggle to bridge the gap between
                  aspiration and achievement. Often, it's not a lack of knowledge holding them back—it's the lack of
                  exposure, opportunity, and real-time learning experiences that can truly transform them.
                </p>

                <p className="text-xl font-medium text-[#900000]">
                  That's where <SteiText /> steps in.
                </p>

                <p>
                  <SteiText /> was founded with a simple yet powerful mission:{" "}
                  <span className="font-semibold">Accessibility & Empowerment</span>. We believe that learning should be
                  anytime, anywhere, for anyone & everyone. More than just skills, we focus on self-discovery and
                  growth, ensuring that every individual has the tools they need to show up confidently, communicate
                  effectively, and take charge of their success.
                </p>

                <p>
                  Through our interactive, hands-on workshops, we aren't just skilling people—we're building a movement.
                  A community of thinkers, doers, and achievers who recognise that personal development isn't a
                  luxury—it's a necessity.
                </p>

                <div className="py-4 px-6 bg-gray-50 rounded-lg border-l-4 border-[#900000] my-8">
                  <p className="font-medium mb-2">Is it easy? No.</p>
                  <p className="font-medium mb-2">Is it doable? Absolutely.</p>
                  <p className="font-medium">And no one has to do it alone.</p>
                </div>

                <p>The journey has just begun, and we're here to bridge the gap, one transformation at a time.</p>

                <p className="text-xl font-medium text-center mt-8">Join us. Let's grow together.</p>
              </div>

              <div className="mt-12 flex justify-center">
                <Link
                  href="/workshops"
                  className="bg-[#900000] hover:bg-[#700000] text-white font-medium py-3 px-8 rounded-full transition-all duration-300"
                >
                  Explore Our Workshops
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Elements Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Accessibility</h3>
              <p className="text-gray-600">
                Learning opportunities that are accessible to everyone, regardless of background or experience level.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Empowerment</h3>
              <p className="text-gray-600">
                Equipping individuals with the confidence and skills to take charge of their personal and professional
                growth.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Community</h3>
              <p className="text-gray-600">
                Building a supportive network of like-minded individuals committed to continuous improvement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

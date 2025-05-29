"use client"

import { useState, useEffect } from "react"
import Banner from "@/components/banner"
import UniqueFeatures from "@/components/unique-features"
import SteiText from "@/components/stei-text"
import InspirationSection from "@/app/components/inspiration-section"

const OurMission = () => {
  return (
    <section className="py-6 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#900000]">Our Mission</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Spinning STEI Logo */}
            <div className="flex justify-center items-center p-4 bg-gray-50">
              <div className="scale-90">
                <div className="relative w-40 h-40">
                  <svg
                    className="w-full h-full animate-spin-slow"
                    viewBox="0 0 100 100"
                    style={{
                      transform: "rotate(45.96deg)",
                      animation: "spin 20s linear infinite",
                    }}
                  >
                    <style jsx>{`
                      @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                      }
                    `}</style>
                    <defs>
                      <path id="circlePath" d="M50,50 m-35,0a35,35 0 1,1 70,0a35,35 0 1,1 -70,0"></path>
                    </defs>
                    <text fontSize="5" fontWeight="bold" fill="black">
                      <textPath href="#circlePath" startOffset="0%">
                        🔴 EMPOWERING INDIVIDUALS • EMPOWERING INDIVIDUALS •
                      </textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                      <span className="font-serif flex items-baseline inline-flex mx-1">
                        <span className="text-black">s</span>
                        <span className="text-black text-[1.2em] leading-none">t</span>
                        <span className="text-black">e</span>
                        <span className="text-[#900000]">i</span>
                      </span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Section */}
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-bold text-[#900000]">Accessibility and Empowerment</h3>

              <div>
                <h4 className="font-bold text-[#900000]">Accessibility</h4>
                <p className="text-sm text-gray-700">Learning Anytime, Anywhere and for Anyone & Everyone</p>
              </div>

              <div>
                <h4 className="font-bold text-[#900000]">Empowerment</h4>
                <p className="text-sm text-gray-700">
                  Joining individuals on their journey of self-discovery and growth
                </p>
              </div>

              <p className="text-sm text-gray-700">
                At <SteiText />, we are dedicated to making transformative education accessible to all, regardless of
                location or background. We believe in empowering each person to reach their full potential through
                guidance, tools, and mindset development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Mark as loaded after component mounts
    setIsLoaded(true)
  }, [])

  // Simple loading state to ensure client-side components are ready
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#D40F14] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Banner />
      <OurMission />
      <UniqueFeatures />
      <InspirationSection />
    </div>
  )
}

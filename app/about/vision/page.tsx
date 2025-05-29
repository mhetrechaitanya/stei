import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our Vision | STEI - Empowering Individuals",
  description:
    "Bridging the gap between aspiration and achievement through facilitating real-time interactive learning that transforms.",
}

export default function VisionPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with background */}
          <div className="bg-gradient-to-r from-[#D40F14] to-[#FF4D4D] p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Vision</h1>
            <div className="w-20 h-1 bg-white rounded"></div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Bridging the Gap</h2>

              <p className="text-xl leading-relaxed text-gray-700 mb-8">
                To bridge the gap between aspiration and achievement, through facilitating, real-time interactive
                learning that transforms.
              </p>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-xl font-medium text-gray-800 mb-4">What This Means For You</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-[#D40F14] p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>We identify the skills you need to achieve your goals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-[#D40F14] p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>We provide interactive learning experiences that develop those skills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-[#D40F14] p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>We transform your potential into tangible achievements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

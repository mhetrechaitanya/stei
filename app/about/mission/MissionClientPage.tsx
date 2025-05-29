"use client"

export default function MissionClientPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Red header section */}
      <div className="bg-[#D40F14] py-12 px-8">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Our Mission</h1>
          <div className="w-32 h-1 bg-white mt-2"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-8 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#900000] mb-6">Accessibility and Empowerment</h2>

        <p className="text-lg text-[#333333] mb-12 max-w-3xl">
          To make transformative education accessible to all and empower individuals on their journey of self-discovery
          and growth, creating opportunities for learning anytime, anywhere, and for anyone.
        </p>

        {/* What this means section */}
        <div className="bg-gray-50 p-8 rounded-md max-w-3xl mb-12">
          <h3 className="text-2xl font-bold text-[#900000] mb-6">What This Means For You</h3>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D40F14] flex items-center justify-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-lg text-[#333333]">
                <strong className="text-[#900000] text-xl">Accessibility:</strong> Learning Anytime, Anywhere and for
                Anyone & Everyone
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D40F14] flex items-center justify-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-lg text-[#333333]">
                <strong className="text-[#900000] text-xl">Empowerment:</strong> Joining individuals on their journey of
                self-discovery and growth
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D40F14] flex items-center justify-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-lg text-[#333333]">
                We create transformative learning experiences that help you achieve your full potential
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

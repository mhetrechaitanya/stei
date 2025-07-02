export default function StrengthOfSheFeatures() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Unique Features</h2>
          <div className="h-1 w-24 bg-[#D40F14] mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            What makes The Strength of She workshop a transformative experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-[#FFF5F5] rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-[#D40F14] rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-center text-gray-800">personalised Growth</h3>
            <p className="text-gray-600 text-center">
              Tailored exercises and reflections designed specifically for women's unique professional challenges.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#FFF5F5] rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-[#D40F14] rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-center text-gray-800">Supportive Community</h3>
            <p className="text-gray-600 text-center">
              Connect with like-minded women who understand your journey and provide ongoing support.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#FFF5F5] rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-[#D40F14] rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-center text-gray-800">Practical Empowerment</h3>
            <p className="text-gray-600 text-center">
              Actionable strategies to overcome workplace challenges and build confidence in professional settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

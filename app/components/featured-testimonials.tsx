"use client"

export default function FeaturedTestimonials() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Personal Experience with Mentor</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear directly from those who have experienced our transformative mentorship
          </p>
        </div>

        <div className="max-w-4xl mx-auto mt-20">
          {/* Removed SalmanTestimonial component */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-700">
              We're currently collecting experiences from our workshop participants. Check back soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import TestimonialCard from "./testimonial-card"
import TestimonialPopup from "./testimonial-popup"

export default function TestimonialsShowcase() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<null | {
    name: string
    role?: string
    image?: string
    fullText: string
  }>(null)

  // Empty testimonials array - no personal data
  const testimonials: {
    name: string
    role?: string
    image?: string
    quote: string
    year?: string
    featured?: boolean
  }[] = []

  return (
    <div className="py-12">
      <h2 className="text-3xl font-semibold text-center">Personal Experience with Mentor</h2>
      <p className="mt-2 text-lg text-center text-gray-600">
        Read about the experiences of individuals who have benefited from mentorship.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mt-16">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="mt-12">
            <TestimonialCard
              {...testimonial}
              onReadMore={() =>
                setSelectedTestimonial({
                  name: testimonial.name,
                  role: testimonial.role,
                  image: testimonial.image,
                  fullText: testimonial.quote,
                })
              }
            />
          </div>
        ))}
      </div>

      {selectedTestimonial && (
        <TestimonialPopup {...selectedTestimonial} onClose={() => setSelectedTestimonial(null)} />
      )}
    </div>
  )
}

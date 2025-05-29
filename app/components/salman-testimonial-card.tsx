"use client"

import { useState } from "react"
import Image from "next/image"
import TestimonialPopup from "./testimonial-popup"

export default function SalmanTestimonialCard() {
  const [showPopup, setShowPopup] = useState(false)

  const fullTestimonial = `I had the privilege of being associated with Sandhya Mam between 2011 and 2013, and the impact she had on my life goes far beyond Business Communication. As a mentor, she didn't just teach us the fundamentals of business and management but also transformed my entire personality and vision. Her ability to recognize potential and nurture talent is unparalleled—she truly has a keen eye for discovering and honing skills in people. 

What sets Sandhya Mam apart is her holistic approach to mentorship. Whether it was refining our communication skills, sharpening our leadership abilities, or instilling a deep understanding of business strategies, she equipped us with the tools to excel in every aspect of life. Her passion for empowering students and constantly sharing valuable knowledge makes her an exceptional educator and guide. She didn't just teach us; she inspired us to be better versions of ourselves. I am grateful for her mentorship, which continues to influence my personal and professional journey.`

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-md mx-auto">
        <div className="flex flex-col items-center p-6 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-6 bg-gray-200">
            <Image
              src="/images/testimonials/salman-rajkotwala.png"
              alt="Salman Rajkotwala"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto opacity-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          <p className="text-gray-700 mb-6 text-center">
            "I had the privilege of being associated with Sandhya Mam between 2011 and 2013, and the impact she had on
            my life goes far beyond Business Communication. As a mentor, she didn't just teach us the fundamentals of
            business and management but also transformed my entire personality and vision..."
          </p>

          <button onClick={() => setShowPopup(true)} className="text-[#D40F14] font-medium hover:underline mb-4">
            Read More
          </button>

          <div>
            <h3 className="text-xl font-bold text-gray-800">Salman Rajkotwala</h3>
            <p className="text-[#D40F14]">Al Wathba Insurance</p>
          </div>
        </div>
      </div>

      {showPopup && (
        <TestimonialPopup
          name="Salman Rajkotwala"
          role="Al Wathba Insurance"
          image="/images/testimonials/salman-rajkotwala.png"
          fullText={fullTestimonial}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  )
}

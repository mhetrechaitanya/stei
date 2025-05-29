"use client"

import { useState } from "react"
import Image from "next/image"
import TestimonialPopup from "./testimonial-popup"

export default function ShahzannTestimonialCard() {
  const [showPopup, setShowPopup] = useState(false)

  const fullTestimonial = `Dr. Sandhya Tewari was my professor during my Post-Graduate Diploma in Pharmaceutical Management in 2006-07. She taught us Human Resource Management and played an instrumental role in shaping our personalities for placements and interviews. Her lectures were always insightful, packed with real-world knowledge, and her teaching methods were incredibly motivating. 

What sets Dr. Tewari apart is her ability to blend kindness and empathy with the precision of giving constructive feedback that propels you forward. Her unwavering commitment to nurturing talent left a lasting impression on me, and even after all these years, she remains someone I deeply respect and look up to for her wisdom and guidance. 

Today, as a creative professional in market research, with over a decade of experience in clinical research and digital marketing, and with being a consultant for budding brands, I still find myself inspired by the lessons she imparted. Her emphasis on building confidence and honing professional skills has been invaluable in my professional and personal journey. 

I wish Dr. Tewari all the very best for her new venture, STEI. I am certain she will continue to create dynamic professionals and inspire countless others through her remarkable career, just as she inspired me. Lots of love and light`

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-md mx-auto">
        <div className="flex flex-col items-center p-6 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-6 bg-gray-200">
            <Image
              src="/images/testimonials/shahzann-dadachanji.jpeg"
              alt="Shahzann A Dadachanji"
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
            "Dr. Sandhya Tewari was my professor during my Post-Graduate Diploma in Pharmaceutical Management in
            2006-07. She taught us Human Resource Management and played an instrumental role in shaping our
            personalities for placements and interviews..."
          </p>

          <button onClick={() => setShowPopup(true)} className="text-[#D40F14] font-medium hover:underline mb-4">
            Read More
          </button>

          <div>
            <h3 className="text-xl font-bold text-gray-800">Shahzann A Dadachanji</h3>
            <p className="text-[#D40F14]">PHARMACEUTICAL MANAGEMENT</p>
          </div>
        </div>
      </div>

      {showPopup && (
        <TestimonialPopup
          name="Shahzann A Dadachanji"
          role="PHARMACEUTICAL MANAGEMENT"
          image="/images/testimonials/shahzann-dadachanji.jpeg"
          fullText={fullTestimonial}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  )
}

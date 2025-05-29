"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function SalmanTestimonial() {
  const [showFullTestimonial, setShowFullTestimonial] = useState(false)

  const testimonialText = `I had the privilege of being associated with Sandhya Mam between 2011 and 2013, and the impact she had on my life goes far beyond Business Communication. As a mentor, she didn't just teach us the fundamentals of business and management but also transformed my entire personality and vision. Her ability to recognize potential and nurture talent is unparalleled—she truly has a keen eye for discovering and honing skills in people.

What sets Sandhya Mam apart is her holistic approach to mentorship. Whether it was refining our communication skills, sharpening our leadership abilities, or instilling a deep understanding of business strategies, she equipped us with the tools to excel in every aspect of life. Her passion for empowering students and constantly sharing valuable knowledge makes her an exceptional educator and guide. She didn't just teach us; she inspired us to be better versions of ourselves.

I am grateful for her mentorship, which continues to influence my personal and professional journey.`

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 relative border-2 border-[#D40F14]">
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#D40F14] shadow-md">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Salman%20Rajkotwala-KoYLyC3aJaaJF9mHeHZvKwdVfAGIT5.jpeg"
            alt="Salman Rajkotwala"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      <div className="pt-14 text-center">
        <svg className="w-10 h-10 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-gray-700 mb-4">{testimonialText.substring(0, 300)}...</p>

        <Link
          href="/experiences/salman-rajkotwala"
          className="text-[#D40F14] font-medium hover:underline mt-2 inline-block"
        >
          Read Full Experience
        </Link>

        <h4 className="text-lg font-bold text-gray-800 mt-4">Salman Rajkotwala</h4>
        <p className="text-[#D40F14]">Al Wathba Insurance</p>
        <p className="text-gray-500 text-sm mt-1">(2011-2013)</p>

        <div className="absolute top-4 right-4">
          <span className="bg-[#D40F14] text-white text-xs px-2 py-1 rounded-full">Featured</span>
        </div>
      </div>
    </div>
  )
}

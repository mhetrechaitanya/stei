"use client"

import { useState } from "react"
import Image from "next/image"
import TestimonialPopup from "./testimonial-popup"

const testimonialText = `I write this testimonial to express my sincere gratitude and admiration for Professor Sandhya Tiwari. I feel obliged to have been one of her students in the year 2011-2013, when I was studying for my Masters. While it is no news that she is an exceptional educator, what makes her special for the likes of me is how well she sees right through you! We have all struggled with self-doubt & uncertainty during our learning years, & it isn't uncommon to find people who have well-meaning suggestions to offer at this stage. But finding someone who works with you, helping you find your own answers – jackpot! Many can offer you encouragement in life, Professor Sandhya offers you the precious gift of the ability to renew your sense of self-confidence. One other distinctive power Professor Sandhya has, that I have forever looked up to & have always strived to emulate, is to always speak clearly and directly, no matter what. Calling a spade, a spade is after all not everyone's cup of tea! Having shaped a lot of who I am today, this special bond with Professor is something I will always hold close to my heart…`

export default function VrindaTestimonialCard() {
  const [showPopup, setShowPopup] = useState(false)

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-6">
            <Image
              src="/images/testimonials/vrinda-menon.jpeg"
              alt="Vrinda Menon"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="text-gray-400 text-5xl mb-4">"</div>

          <p className="text-gray-700 mb-6 line-clamp-6">{testimonialText}</p>

          <button onClick={() => setShowPopup(true)} className="text-[#D40F14] font-medium hover:underline mb-4">
            Read More
          </button>

          <h3 className="text-xl font-bold text-gray-800">Vrinda Menon</h3>
          <p className="text-[#D40F14]">Entrata India Pvt Ltd</p>
        </div>
      </div>

      {showPopup && (
        <TestimonialPopup
          name="Vrinda Menon"
          role="Entrata India Pvt Ltd"
          image="/images/testimonials/vrinda-menon.jpeg"
          fullText={testimonialText}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  )
}

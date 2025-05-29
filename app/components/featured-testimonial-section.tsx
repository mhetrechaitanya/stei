"use client"

import { useEffect, useRef } from "react"
import SalmanTestimonialCard from "./salman-testimonial-card"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function FeaturedTestimonialSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        // Animate title
        gsap.fromTo(
          titleRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
          },
        )

        // Animate card
        gsap.fromTo(
          cardRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: cardRef.current, start: "top 80%" },
            delay: 0.2,
          },
        )
      }, sectionRef)

      return () => ctx.revert()
    }
  }, [])

  return (
    <div ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 ref={titleRef} className="text-3xl font-bold text-gray-800 mb-4">
            Featured Testimonial
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our participants about their transformative experiences
          </p>
        </div>

        <div ref={cardRef}>
          <SalmanTestimonialCard />
        </div>
      </div>
    </div>
  )
}

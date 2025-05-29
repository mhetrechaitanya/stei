"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ChevronLeft } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function HomeTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const testimonialRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const testimonials = []

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        // Animate the container
        gsap.fromTo(
          containerRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
          },
        )

        // Animate the first testimonial
        if (testimonialRefs.current[0]) {
          gsap.fromTo(
            testimonialRefs.current[0],
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", delay: 0.3 },
          )
        }
      }, containerRef)

      return () => ctx.revert()
    }
  }, [])

  const animateTestimonial = (index: number) => {
    if (isAnimating) return
    setIsAnimating(true)

    const current = testimonialRefs.current[currentTestimonial]
    const next = testimonialRefs.current[index]

    if (current && next) {
      gsap.to(current, { opacity: 0, x: -50, duration: 0.5, ease: "power2.inOut" })
      gsap.fromTo(
        next,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.inOut",
          delay: 0.3,
          onComplete: () => setIsAnimating(false),
        },
      )
    }

    setCurrentTestimonial(index)
  }

  const nextTestimonial = () => {
    if (isAnimating || testimonials.length === 0) return
    const nextIndex = (currentTestimonial + 1) % testimonials.length
    animateTestimonial(nextIndex)
  }

  const prevTestimonial = () => {
    if (isAnimating || testimonials.length === 0) return
    const prevIndex = (currentTestimonial - 1 + testimonials.length) % testimonials.length
    animateTestimonial(prevIndex)
  }

  return (
    <div ref={containerRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Personal Experience with Mentor</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear directly from those who have experienced our transformative mentorship
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {testimonials.length > 0 ? (
            testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                ref={(el) => (testimonialRefs.current[index] = el)}
                className="bg-white rounded-xl shadow-lg p-8 transition-all duration-500"
                style={{
                  opacity: index === currentTestimonial ? 1 : 0,
                  position: index === currentTestimonial ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  visibility: index === currentTestimonial ? "visible" : "hidden",
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#D40F14] mb-6">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <svg className="w-10 h-10 text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  <p className="text-gray-700 mb-6">{testimonial.quote}</p>

                  <h3 className="text-xl font-bold text-gray-800">{testimonial.name}</h3>
                  <p className="text-[#D40F14] mb-4">{testimonial.role}</p>

                  {testimonial.link && (
                    <Link href={testimonial.link} className="text-[#D40F14] font-medium hover:underline">
                      Read Full Experience
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <svg className="w-10 h-10 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-700 mb-6">
                We're currently collecting experiences from our workshop participants. Check back soon!
              </p>
            </div>
          )}

          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg z-10 hidden md:block"
                disabled={isAnimating}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg z-10 hidden md:block"
                disabled={isAnimating}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

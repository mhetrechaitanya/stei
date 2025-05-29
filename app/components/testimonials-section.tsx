"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { Quote } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Update the testimonials array to use real images instead of placeholders
const testimonials = []

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const testimonialRefs = useRef<(HTMLDivElement | null)[]>([])
  const quoteIconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current || !quoteIconRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Create a timeline for the section header
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      })

      headerTl.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        0,
      )

      headerTl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        0.2,
      )

      // Animate quote icon
      headerTl.fromTo(
        quoteIconRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" },
        0.4,
      )

      // Set up continuous floating animation for quote icon
      gsap.to(quoteIconRef.current, {
        y: 15,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })

      // Animate initial testimonial
      animateTestimonial(0)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Effect for testimonial changes
  useEffect(() => {
    animateTestimonial(activeIndex)
  }, [activeIndex])

  const animateTestimonial = (index: number) => {
    if (!testimonialRefs.current) return

    // Hide all testimonials first
    testimonialRefs.current.forEach((testimonial, i) => {
      if (!testimonial) return

      if (i !== index) {
        gsap.set(testimonial, { opacity: 0, x: i < index ? -50 : 50 })
      }
    })

    // Animate the active testimonial
    const testimonial = testimonialRefs.current[index]
    if (!testimonial) return

    gsap.fromTo(testimonial, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" })
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section ref={sectionRef} className="py-20 bg-[#D40F14]/5 animate-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          <div ref={quoteIconRef} className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-[#D40F14] rounded-full p-4 shadow-lg">
              <Quote className="h-8 w-8 text-white" />
            </div>
          </div>

          <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 pt-10">
            Personal Experience with Mentor
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from individuals who have transformed their lives through our programmes.
          </p>
        </div>

        {testimonials.length > 0 ? (
          <div className="max-w-4xl mx-auto relative">
            <div className="relative h-[300px] overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  ref={(el) => (testimonialRefs.current[index] = el)}
                  className="absolute inset-0 flex flex-col md:flex-row items-center gap-8 bg-white rounded-xl p-8 shadow-lg"
                  style={{ opacity: index === activeIndex ? 1 : 0 }}
                >
                  <div className="md:w-1/3">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-[#D40F14] mx-auto">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="md:w-2/3 text-center md:text-left">
                    <p className="text-lg text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                    <h4 className="text-xl font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={goToPrev}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-full shadow"
              >
                Previous
              </button>
              <button
                onClick={goToNext}
                className="bg-[#D40F14] hover:bg-[#B00D11] text-white font-semibold py-2 px-4 rounded-full shadow"
              >
                Next
              </button>
            </div>

            <div className="flex justify-center mt-4 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeIndex ? "bg-[#D40F14] scale-125" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg text-center">
            <p className="text-lg text-gray-600">
              Coming soon! We're collecting experiences from our workshop participants.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SteiText from "@/app/components/stei-text"

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Create a timeline for the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      })

      // Animate the title
      tl.fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0)

      // Animate the cards with stagger
      tl.fromTo(
        cardRefs.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: "power2.out" },
        0.3,
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
          <SteiText /> Workshops & Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Workshop Card 1 */}
          <div
            ref={(el) => (cardRefs.current[0] = el)}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105"
          >
            <div className="relative h-48">
              <Image src="/placeholder.svg?height=400&width=600" alt="Workshop" fill className="object-cover" />
            </div>
            <div className="p-6 border-t-4 border-[#D40F14]">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Personal Development</h3>
              <p className="text-gray-600 mb-4">
                Discover your potential through our transformative personal development workshops designed to enhance
                self-awareness and confidence.
              </p>
              <a
                href="/workshops"
                className="inline-block bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Workshop Card 2 */}
          <div
            ref={(el) => (cardRefs.current[1] = el)}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105"
          >
            <div className="relative h-48">
              <Image src="/placeholder.svg?height=400&width=600" alt="Workshop" fill className="object-cover" />
            </div>
            <div className="p-6 border-t-4 border-[#D40F14]">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Communication Skills</h3>
              <p className="text-gray-600 mb-4">
                Master the art of effective communication with our specialized workshops focused on verbal and
                non-verbal communication techniques.
              </p>
              <a
                href="/workshops"
                className="inline-block bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Workshop Card 3 */}
          <div
            ref={(el) => (cardRefs.current[2] = el)}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105"
          >
            <div className="relative h-48">
              <Image src="/placeholder.svg?height=400&width=600" alt="Workshop" fill className="object-cover" />
            </div>
            <div className="p-6 border-t-4 border-[#D40F14]">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Leadership Training</h3>
              <p className="text-gray-600 mb-4">
                Develop essential leadership skills with our comprehensive training programs designed for aspiring and
                established leaders.
              </p>
              <a
                href="/workshops"
                className="inline-block bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

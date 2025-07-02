"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SteiText from "@/app/components/stei-text"

export default function MissionSection() {
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
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
          <SteiText /> Mission & Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission Card */}
          <div
            ref={(el) => (cardRefs.current[0] = el)}
            className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-[#D40F14] transform transition-transform hover:scale-105"
          >
            <h3 className="text-xl font-bold mb-4 text-[#D40F14]">Our Mission</h3>
            <p className="text-gray-600">
              <SteiText /> is committed to empowering individuals through accessible education and personalised
              development programs that foster growth, confidence, and success in all aspects of life.
            </p>
          </div>

          {/* Vision Card */}
          <div
            ref={(el) => (cardRefs.current[1] = el)}
            className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-[#D40F14] transform transition-transform hover:scale-105"
          >
            <h3 className="text-xl font-bold mb-4 text-[#D40F14]">Our Vision</h3>
            <p className="text-gray-600">
              We envision a world where everyone has the opportunity to discover their potential and develop the skills
              needed to thrive in an ever-changing global landscape.
            </p>
          </div>

          {/* Values Card */}
          <div
            ref={(el) => (cardRefs.current[2] = el)}
            className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-[#D40F14] transform transition-transform hover:scale-105"
          >
            <h3 className="text-xl font-bold mb-4 text-[#D40F14]">Our Values</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Accessibility for all</li>
              <li>• personalised approach</li>
              <li>• Continuous innovation</li>
              <li>• Integrity and authenticity</li>
              <li>• Community and support</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

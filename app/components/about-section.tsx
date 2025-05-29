"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SteiText from "@/app/components/stei-text"

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([])

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

      // Animate the image
      tl.fromTo(imageRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0)

      // Animate the title
      tl.fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.3)

      // Animate the paragraphs with stagger
      tl.fromTo(
        textRefs.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: "power2.out" },
        0.5,
      )

      // Create a parallax effect for the image
      gsap.to(imageRef.current, {
        y: 50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-white animate-section">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div ref={imageRef} className="md:w-1/2 relative">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
              <Image src="/placeholder.svg?height=800&width=600" alt="About STEI" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D40F14] rounded-full flex items-center justify-center text-white font-bold text-xl">
              Since 2010
            </div>
          </div>

          <div ref={contentRef} className="md:w-1/2">
            <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              The <SteiText /> Story: Empowering Individuals
            </h2>

            <p ref={(el) => (textRefs.current[0] = el)} className="text-lg text-gray-600 mb-4">
              Community. We believe that everyone has untapped potential waiting to be discovered.
            </p>

            <p ref={(el) => (textRefs.current[1] = el)} className="text-lg text-gray-600 mb-4">
              Our approach combines proven methodologies with innovative techniques to help individuals develop
              essential skills for personal and professional growth.
            </p>

            <p ref={(el) => (textRefs.current[2] = el)} className="text-lg text-gray-600 mb-6">
              What makes us unique is our commitment to tailoring our programmes to meet the specific needs of each
              individual, ensuring meaningful and lasting results.
            </p>

            <a
              href="/about"
              className="inline-block bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-3 px-8 rounded-full transition-all duration-300"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

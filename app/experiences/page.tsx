"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Quote, Star, ChevronRight, ChevronLeft } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ParticipantCard from "@/app/components/participant-card"

// Replace the participantExperiences array with generic placeholder content

const participantExperiences = [
  {
    id: 1,
    name: "Salman Rajkotwala",
    role: "Al Wathba Insurance",
    company: "Al Wathba Insurance",
    image: "/images/testimonials/salman-rajkotwala.png",
    experience:
      "I had the privilege of being associated with Sandhya Mam between 2011 and 2013, and the impact she had on my life goes far beyond Business Communication. As a mentor, she didn't just teach us the fundamentals of business and management but also transformed my entire personality and vision. Her ability to recognize potential and nurture talent is unparalleled—she truly has a keen eye for discovering and honing skills in people.",
    workshop: "Business Communication",
    rating: 5,
    date: "2011-2013",
    featured: true,
    link: "/experiences/salman-rajkotwala",
  },
  {
    id: 2,
    name: "Shahzann A Dadachanji",
    role: "Pharmaceutical Management",
    company: "Creative Professional",
    image: "/images/testimonials/shahzann-dadachanji.png",
    experience:
      "Dr. Sandhya Tewari was my professor during my Post-Graduate Diploma in Pharmaceutical Management in 2006-07. Her lectures were always insightful, packed with real-world knowledge, and her teaching methods were incredibly motivating. What sets Dr. Tewari apart is her ability to blend kindness and empathy with the precision of giving constructive feedback that propels you forward.",
    workshop: "Human Resource Management",
    rating: 5,
    date: "2006-2007",
    featured: true,
    link: "/experiences/shahzann-dadachanji",
  },
  {
    id: 3,
    name: "Vrinda Menon",
    role: "Corporate Professional",
    company: "NMIMS Alumni",
    image: "/images/testimonials/vrinda-menon.png",
    experience:
      "I had the privilege of being mentored by Dr. Sandhya Tewari during my time at NMIMS. Her guidance and expertise in business communication have been instrumental in shaping my professional journey. What sets Dr. Tewari apart is her unique ability to identify and nurture individual strengths. She doesn't just teach concepts; she helps you discover your own voice and style.",
    workshop: "Business Communication",
    rating: 5,
    date: "2010-2012",
    featured: true,
    link: "/experiences/vrinda-menon",
  },
  {
    id: 4,
    name: "Participant 4",
    role: "HR Professional",
    company: "Company C",
    image: "/placeholder.svg?height=160&width=160",
    experience:
      "I enrolled in the Emotional Intelligence workshop to improve my ability to handle difficult workplace conversations. The program exceeded my expectations in every way. The expertise in NLP techniques provided me with practical tools to manage emotions and communicate more effectively. The small group format allowed for personalised attention and real-time feedback.",
    workshop: "Emotional Intelligence",
    rating: 5,
    date: "February 2023",
  },
  {
    id: 5,
    name: "Participant 5",
    role: "Entrepreneur",
    company: "Startup",
    image: "/placeholder.svg?height=160&width=160",
    experience:
      "As a startup founder, I was struggling with pitching my business to potential investors. The Executive Presence workshop transformed my presentation skills and confidence. The feedback was direct but supportive, helping me identify blind spots in my communication style. The techniques I learned for managing nervousness and structuring compelling narratives have been game-changing.",
    workshop: "Executive Presence",
    rating: 5,
    date: "April 2023",
    featured: true,
  },
  {
    id: 6,
    name: "Participant 6",
    role: "Project Manager",
    company: "Company D",
    image: "/placeholder.svg?height=160&width=160",
    experience:
      "The Leadership Development program came at a perfect time in my career as I was transitioning from technical roles to people management. The workshop's focus on authentic leadership and effective delegation resonated with me. The coaching style is engaging and thought-provoking - challenging you to reflect deeply on your leadership approach. The peer learning component was also valuable.",
    workshop: "Leadership Development",
    rating: 4,
    date: "December 2022",
  },
]

export default function ExperiencesPage() {
  const [currentExperience, setCurrentExperience] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const experienceRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        // Animate title and subtitle
        gsap.fromTo(
          titleRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
          },
        )

        gsap.fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: subtitleRef.current, start: "top 80%" },
            delay: 0.2,
          },
        )

        // Animate cards
        if (cardsRef.current) {
          gsap.fromTo(
            cardsRef.current.children,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
            },
          )
        }

        // Animate the featured experience
        animateExperience(0)
      }, sectionRef)

      return () => ctx.revert()
    }
  }, [])

  const animateExperience = (index: number) => {
    if (isAnimating) return
    setIsAnimating(true)

    const current = experienceRefs.current[currentExperience]
    const next = experienceRefs.current[index]

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

    setCurrentExperience(index)
  }

  const nextExperience = () => {
    if (isAnimating) return
    const nextIndex = (currentExperience + 1) % participantExperiences.length
    animateExperience(nextIndex)
  }

  const prevExperience = () => {
    if (isAnimating) return
    const prevIndex = (currentExperience - 1 + participantExperiences.length) % participantExperiences.length
    animateExperience(prevIndex)
  }

  return (
    <div ref={sectionRef} className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px]">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Participant Experiences"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 ref={titleRef} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Participant Experiences
            </h1>
            <p ref={subtitleRef} className="text-xl text-white/90 mb-4">
              Real stories from individuals who have transformed their careers with our mentorship
            </p>
            <div className="w-20 h-1 bg-[#D40F14]"></div>
          </div>
        </div>
      </div>

      {/* Featured Experience Showcase */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Experiences</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear directly from our participants about their transformative journeys with our mentors
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {participantExperiences.map((experience, index) => (
              <div
                key={experience.id}
                ref={(el) => (experienceRefs.current[index] = el)}
                className="bg-white rounded-xl shadow-lg p-8 md:p-12 transition-all duration-500"
                style={{
                  opacity: index === currentExperience ? 1 : 0,
                  position: index === currentExperience ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  visibility: index === currentExperience ? "visible" : "hidden",
                }}
              >
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-[#D40F14] mb-4">
                      <Image
                        src={experience.image || "/placeholder.svg?height=160&width=160"}
                        alt={experience.name}
                        width={160}
                        height={160}
                        className="object-cover"
                        onError={(e) => {
                          // @ts-ignore - fallback to placeholder on error
                          e.target.src = "/placeholder.svg?height=160&width=160"
                        }}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 text-center">{experience.name}</h3>
                    <p className="text-[#D40F14] font-medium text-center">{experience.role}</p>
                    <p className="text-gray-600 text-center mb-4">{experience.company}</p>

                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < experience.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mb-6 text-center">
                      Workshop: <span className="font-medium">{experience.workshop}</span>
                    </div>

                    {experience.link && (
                      <Link
                        href={experience.link}
                        className="bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-4 rounded-full text-sm"
                      >
                        Read Full Experience
                      </Link>
                    )}
                  </div>

                  <div className="md:w-2/3">
                    <div className="relative">
                      <Quote className="h-12 w-12 text-[#D40F14]/20 absolute -top-6 -left-6" />
                      <p className="text-gray-700 text-lg leading-relaxed mb-6 relative z-10">
                        {experience.experience}
                      </p>
                      <div className="text-right text-gray-500 italic">{experience.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation buttons */}
            <button
              onClick={prevExperience}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg z-10 hidden md:block"
              disabled={isAnimating}
              aria-label="Previous experience"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextExperience}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg z-10 hidden md:block"
              disabled={isAnimating}
              aria-label="Next experience"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Mobile navigation buttons */}
            <div className="flex justify-center mt-8 gap-4 md:hidden">
              <button
                onClick={prevExperience}
                className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-full shadow border border-gray-200"
                disabled={isAnimating}
              >
                Previous
              </button>
              <button
                onClick={nextExperience}
                className="bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-4 rounded-full shadow"
                disabled={isAnimating}
              >
                Next
              </button>
            </div>

            {/* Pagination indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {participantExperiences.map((_, index) => (
                <button
                  key={index}
                  onClick={() => animateExperience(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentExperience ? "bg-[#D40F14] scale-125" : "bg-gray-300"
                  }`}
                  aria-label={`Go to experience ${index + 1}`}
                  disabled={isAnimating}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Experiences Grid */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">All Participant Experiences</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse through the experiences of participants from various workshops and programs
            </p>
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {participantExperiences.map((experience) => (
              <ParticipantCard
                key={experience.id}
                name={experience.name}
                role={experience.role}
                company={experience.company}
                image={experience.image}
                experience={experience.experience}
                workshop={experience.workshop}
                rating={experience.rating}
                date={experience.date}
                featured={experience.featured}
                onClick={() => {
                  if (experience.link) {
                    window.location.href = experience.link
                  } else {
                    const index = participantExperiences.findIndex((exp) => exp.id === experience.id)
                    if (index !== -1) {
                      animateExperience(index)
                      // Scroll to featured section
                      document.querySelector(".py-16.bg-white")?.scrollIntoView({ behavior: "smooth" })
                    }
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-[#D40F14]/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Start Your Transformation?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join our workshops and experience the same growth and success as our participants
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/workshops"
              className="bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all duration-300"
            >
              Explore Workshops
            </Link>
            <Link
              href="/contact"
              className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-8 rounded-full shadow-lg border border-gray-200 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

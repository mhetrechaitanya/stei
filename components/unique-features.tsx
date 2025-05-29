"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import SteiText from "./stei-text"
import FounderPopup from "@/app/components/founder-popup"

const features = [
  {
    id: 1,
    title: "Self-Growth Platform",
    description: "Your foundation for personal and professional development.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/self%20growth-Dq9NfPnNHwyrcF74kLvUGEtF76kWSh.webp",
    link: "/about#unique",
  },
  {
    id: 2,
    title: "Live Interactive Sessions",
    description: "Real-time interactive sessions designed to engage, enable and inspire growth.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Live%20interactive%20sessions.jpg-rRo36EGhvpYrpvR6spxWltwjTgttBb.jpeg",
    link: "/about#mentors",
  },
  {
    id: 3,
    title: "Focused on Transformation",
    description: "Practical, actionable strategies for measurable results.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_t5c26yt5c26yt5c2.jpg-iLd396GsgAk6yYL6qyrMcLGkb517JQ.jpeg",
    link: "/products-services#iace",
  },
  {
    id: 4,
    title: "Bilingual Accessibility",
    description: "Workshops in both English and Hindi languages for our diverse audience.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bilingual%20accessability.jpg-9c1YWaJ3sO2Dbdnhv260dbpXs78sfS.jpeg",
    link: "/about#support",
  },
]

// Add this new array for the movement cards below the features array
const movementCards = [
  {
    id: 1,
    title: "Community",
    description:
      "We are a community dedicated to enablement and empowerment",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Community-sm0HExoBL5SyfCgT99q4n3teC3xbb1.jpeg",
    link: "/join",
  },
  {
    id: 2,
    title: "Personal Growth",
    description: "Embark on a transformative journey with us.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Personal%20Growth-h4qVreduaeoD2W1gieEJCEUy2TuKkO.png",
    link: "/workshops",
  },
  {
    id: 3,
    title: "Empowerment",
    description: "Identify and reach your full potential.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Empowerment%20Image-nWpx4toFPPhhZYmmmAtydQ0mEdCzUQ.jpeg",
    link: "/stories",
  },
]

export default function UniqueFeatures() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [showTestimonialPopup, setShowTestimonialPopup] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<{
    name: string
    role: string
    image: string
    fullText: string
  } | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [showFounderPopup, setShowFounderPopup] = useState(false)

  const openTestimonialPopup = (name: string, role: string, image: string, fullText: string) => {
    setSelectedTestimonial({ name, role, image, fullText })
    setShowTestimonialPopup(true)
  }

  const closeTestimonialPopup = () => {
    setShowTestimonialPopup(false)
  }

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* What Makes STEI Unique Section */}
        <div className="text-center mb-16 relative max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            What Makes <SteiText className="mx-1" /> Unique
          </h2>
          <div className="h-1 w-24 bg-[#D40F14] mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the <SteiText className="mx-1" /> difference and how our unique approach can help you achieve your
            goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <a
              href={feature.link}
              key={feature.id}
              className={cn(
                "group relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-500 block",
                hoveredCard === feature.id ? "scale-105 shadow-xl z-10" : "scale-100",
              )}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-36 overflow-hidden">
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-700",
                    hoveredCard === feature.id ? "scale-110" : "scale-100",
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-[#D40F14]/90 to-transparent opacity-0 transition-opacity duration-500",
                    hoveredCard === feature.id ? "opacity-70" : "",
                  )}
                />
              </div>

              <div className="p-4 relative">
                <div
                  className={cn(
                    "absolute top-0 left-0 w-1 h-0 bg-[#D40F14] transition-all duration-500",
                    hoveredCard === feature.id ? "h-full" : "",
                  )}
                />
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-[#D40F14] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Join the STEI Movement Section */}
        <div className="mt-24 mb-16 py-12 px-6 rounded-xl bg-[#FFF5F5] border border-[#FFCDD2]">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Join the <SteiText className="mx-1" /> Movement
            </h2>
            <div className="h-1 w-24 bg-[#D40F14] mx-auto mb-6"></div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-5xl mx-auto">
            {movementCards.map((card) => (
              <div key={card.id} className="flex-1 mb-6 md:mb-0">
                <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col shadow-md hover:shadow-xl">
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={card.image || "/placeholder.svg"}
                      alt={card.title}
                      fill
                      className={cn(card.id === 3 ? "object-contain object-top scale-110" : "object-cover")}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow border border-t-0 border-gray-200 rounded-b-lg">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 hover:text-[#D40F14] transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-gray-600">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workshop Advertisement Section */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header Banner */}
            <div className="bg-[#D40F14] text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-md">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/STEI-Logo-%281%29-w1Rbxxbadl9g4ybZTrCkoRLIpufLlB.png"
                      alt="STEI Logo"
                      width={120}
                      height={60}
                      className="h-10 w-auto"
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">
                    <span className="bg-black px-3 py-2 rounded-full">
                      stei launches its i<span className="text-[#900000]">ACE</span> Series Workshops
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            {/* Workshop Content */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left side - Image */}
                <div className="md:w-1/2">
                  <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Interview-AHezjrq6rAtFTyuvdGRFzfvCPMOrul.jpeg"
                      alt="STEI Interview Workshop Session"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="md:w-1/2 space-y-6">
                  <div>
                    <h2 className="text-4xl font-bold mb-2">
                      i<span className="text-[#D40F14]">ACE</span> Interviews
                    </h2>
                    <p className="text-2xl font-bold text-[#D40F14]">Flagship Workshop</p>
                  </div>

                  <div>
                    <p className="text-xl mb-2">Conducted by</p>
                    <button
                      onClick={() => setShowFounderPopup(true)}
                      className="text-[#007bff] text-xl hover:underline border-none bg-transparent cursor-pointer"
                    >
                      DR. SANDHYA TEWARI (LIFE COACH & MENTOR)
                    </button>
                  </div>

                  <p className="text-gray-700">
                    Interview Skills Workshop is designed to help participants build confidence and master the art of
                    acing interviews. It covers key aspects such as understanding employer expectations and answering
                    common and behavioural questions effectively whilst presenting oneself professionally. Gain
                    practical tips and insight on addressing FAQs by HR to enhance your chances of success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workshops Cards Section */}
        <div className="mt-24 py-16 px-6 rounded-xl bg-[#FFF5F5] border border-[#FFCDD2]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Our Workshops</h2>
            <div className="h-1 w-24 bg-[#D40F14] mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our range of interactive workshops designed to enhance your skills and boost your confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Workshop Card 1 - Updated with new content */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Interview-mvBLBc80AiuspNNDwl3KTe0RtDZXtw.jpeg"
                  alt="STEI iACE Series Workshop"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  i<span className="text-[#900000] font-bold">ACE</span> Series
                </h3>
                <p className="text-gray-600 mb-4">
                  The i<span className="text-[#900000] font-bold">ACE</span> series is designed to help you ace
                  interviews, improve conversational fluency, and create a lasting impact, transforming confidence into
                  empowerment.
                </p>
              </div>
            </div>

            {/* Workshop Card 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/self%20growth-n6N0uU7pdGBM4IxESBbxwxlC56ZAc9.webp"
                  alt="Self-growth Workshop"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  <span className="text-[#900000]">Self-growth</span>
                </h3>
                <p className="text-gray-600 mb-4">
                  Self-growth workshops are curated for those who aspire to evolve, build resilience, present with
                  purpose, and strengthen their drive for success.
                </p>
              </div>
            </div>

            {/* Workshop Card 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Individual%20Impact%20copy-K0eqsUG7AnCSBD9TvSY3xAqnixXtbR.jpeg"
                  alt="The Strength of She Workshop"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  The Strength of <span className="text-[#900000]">She</span>
                </h3>
                <p className="text-gray-600 mb-4">
                  An interactive, reflective workshop for women who carry it all—yet are often unseen. Step in. Claim
                  your power. Discover resilience, and strengthen their drive for success.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="/workshops"
              className="bg-[#D40F14] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#B00D11] transition-colors duration-300 inline-block"
            >
              View All Workshops
            </a>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-24 py-16 px-6 bg-gray-50 rounded-xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Personal Experience with Mentor</h2>
            <div className="h-1 w-24 bg-[#D40F14] mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from individuals who have transformed their lives through our mentorship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20">
            {/* Testimonial 1 - With provided image */}
            <div className="bg-white rounded-xl shadow-lg p-8 relative">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testimonal%201.jpg-m1c8D9k45kuJroQB2oIPTN2lho1G7K.jpeg"
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
                <p className="text-gray-700 mb-4">
                  "I had the privilege of being associated with Sandhya Mam between 2011 and 2013, and the impact she
                  had on my life goes far beyond Business Communication. As a mentor, she didn't just teach us the
                  fundamentals of business and management but also transformed my entire personality and vision..."
                </p>
                <button
                  onClick={() =>
                    openTestimonialPopup(
                      "Salman Rajkotwala",
                      "Al Wathba Insurance",
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testimonal%201.jpg-m1c8D9k45kuJroQB2oIPTN2lho1G7K.jpeg",
                      "I had the privilege of being associated with Sandhya Mam between 2011 and 2013, and the impact she had on my life goes far beyond Business Communication. As a mentor, she didn't just teach us the fundamentals of business and management but also transformed my entire personality and vision. Her ability to recognize potential and nurture talent is unparalleled—she truly has a keen eye for discovering and honing skills in people. What sets Sandhya Mam apart is her holistic approach to mentorship. Whether it was refining our communication skills, sharpening our leadership abilities, or instilling a deep understanding of business strategies, she equipped us with the tools to excel in every aspect of life. Her passion for empowering students and constantly sharing valuable knowledge makes her an exceptional educator and guide. She didn't just teach us; she inspired us to be better versions of ourselves. I am grateful for her mentorship, which continues to influence my personal and professional journey.",
                    )
                  }
                  className="text-[#D40F14] font-medium hover:underline mt-2"
                >
                  Read More
                </button>
                <h4 className="text-lg font-bold text-gray-800 mt-4">Salman Rajkotwala</h4>
                <p className="text-[#D40F14]">Al Wathba Insurance</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 relative">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testimonal%202.jpg-BUheIKGGtmjLMFMB0JnmB1TB9axQu5.jpeg"
                    alt="Shahzann A Dadachanji"
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
                <p className="text-gray-700 mb-4">
                  "Dr. Sandhya Tewari was my professor during my Post-Graduate Diploma in Pharmaceutical Management in
                  2006-07. She taught us Human Resource Management and played an instrumental role in shaping our
                  personalities for placements and interviews..."
                </p>
                <button
                  onClick={() =>
                    openTestimonialPopup(
                      "Shahzann A Dadachanji",
                      "PHARMACEUTICAL MANAGEMENT",
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testimonal%202.jpg-BUheIKGGtmjLMFMB0JnmB1TB9axQu5.jpeg",
                      "Dr. Sandhya Tewari was my professor during my Post-Graduate Diploma in Pharmaceutical Management in 2006-07. She taught us Human Resource Management and played an instrumental role in shaping our personalities for placements and interviews. Her lectures were always insightful, packed with real-world knowledge, and her teaching methods were incredibly motivating. What sets Dr. Tewari apart is her ability to blend kindness and empathy with the precision of giving constructive feedback that propels you forward. Her unwavering commitment to nurturing talent left a lasting impression on me, and even after all these years, she remains someone I deeply respect and look up to for her wisdom and guidance. Today, as a creative professional in market research, with over a decade of experience in clinical research and digital marketing, and with being a consultant for budding brands, I still find myself inspired by the lessons she imparted. Her emphasis on building confidence and honing professional skills has been invaluable in my professional and personal journey. I wish Dr. Tewari all the very best for her new venture, STEI. I am certain she will continue to create dynamic professionals and inspire countless others through her remarkable career, just as she inspired me. Lots of love and light",
                    )
                  }
                  className="text-[#D40F14] font-medium hover:underline mt-2"
                >
                  Read More
                </button>
                <h4 className="text-lg font-bold text-gray-800 mt-4">Shahzann A Dadachanji</h4>
                <p className="text-[#D40F14]">PHARMACEUTICAL MANAGEMENT</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 relative">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testimonal%203.jpg-RPoHDTr2UwPrqbO7D2FdgSI4bmTS9h.jpeg"
                    alt="Vrinda Menon"
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
                <p className="text-gray-700 mb-4">
                  "Professor Sandhya offers you the precious gift of the ability to renew your sense of self-confidence.
                  Having shaped a lot of who I am today, this special bond with Professor is something I will always
                  hold close to my heart."
                </p>
                <button
                  onClick={() =>
                    openTestimonialPopup(
                      "Vrinda Menon",
                      "Entrata India Pvt Ltd",
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testimonal%203.jpg-RPoHDTr2UwPrqbO7D2FdgSI4bmTS9h.jpeg",
                      "I write this testimonial to express my sincere gratitude and admiration for Professor Sandhya Tiwari. I feel obliged to have been one of her students in the year 2011-2013, when I was studying for my Masters. While it is no news that she is an exceptional educator, what makes her special for the likes of me is how well she sees right through you! We have all struggled with self-doubt & uncertainty during our learning years, & it isn't uncommon to find people who have well-meaning suggestions to offer at this stage. But finding someone who works with you, helping you find your own answers – jackpot! Many can offer you encouragement in life, Professor Sandhya offers you the precious gift of the ability to renew your sense of self-confidence. One other distinctive power Professor Sandhya has, that I have forever looked up to & have always strived to emulate, is to always speak clearly and directly, no matter what. Calling a spade, a spade is after all not everyone's cup of tea! Having shaped a lot of who I am today, this special bond with Professor is something I will always hold close to my heart…",
                    )
                  }
                  className="text-[#D40F14] font-medium hover:underline mt-2"
                >
                  Read More
                </button>
                <h4 className="text-lg font-bold text-gray-800 mt-4">Vrinda Menon</h4>
                <p className="text-[#D40F14]">Entrata India Pvt Ltd</p>
              </div>
            </div>
          </div>
        </div>
        {/* Testimonial Popup */}
        {showTestimonialPopup && selectedTestimonial && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D40F14]">
                      <Image
                        src={selectedTestimonial.image || "/placeholder.svg"}
                        alt={selectedTestimonial.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{selectedTestimonial.name}</h3>
                      <p className="text-[#D40F14]">{selectedTestimonial.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeTestimonialPopup}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <svg className="w-10 h-10 text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-700 text-lg leading-relaxed">{selectedTestimonial.fullText}</p>
                </div>

                <div className="text-center">
                  <button
                    onClick={closeTestimonialPopup}
                    className="bg-[#D40F14] text-white px-6 py-2 rounded-full hover:bg-[#B00D11] transition-colors duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Founder Popup */}
        <FounderPopup isOpen={showFounderPopup} onClose={() => setShowFounderPopup(false)} />
      </div>
    </section>
  )
}

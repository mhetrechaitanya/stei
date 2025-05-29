"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Banner data with images and text
const bannerItems = [
  {
    id: 1,
    image: "/placeholder.svg?height=600&width=1200",
    title: "Empowering Individuals",
    description: "Building confidence through personalised coaching",
    ctaText: "Learn More",
    ctaLink: "/about",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=600&width=1200",
    title: "Interactive Workshops",
    description: "Develop essential skills for personal and professional growth",
    ctaText: "Explore Workshops",
    ctaLink: "/products-services#workshops",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=600&width=1200",
    title: "iACE Interview Skills",
    description: "Our flagship workshop for interview excellence",
    ctaText: "Get Started",
    ctaLink: "/products-services#iace-interviews",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=600&width=1200",
    title: "Transform Your Future",
    description: "Join our community of successful professionals",
    ctaText: "See Testimonials",
    ctaLink: "/impressions",
  },
]

export default function BannerAlt() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState<"next" | "prev">("next")
  const autoRotateTimerRef = useRef<NodeJS.Timeout>()
  const slideIntervalMs = 7000 // 7 seconds per slide
  const sliderRef = useRef<HTMLDivElement>(null)

  // Auto-rotate banners
  useEffect(() => {
    if (isPaused) {
      if (autoRotateTimerRef.current) {
        clearTimeout(autoRotateTimerRef.current)
      }
      return
    }

    autoRotateTimerRef.current = setTimeout(() => {
      goToNextBanner()
    }, slideIntervalMs)

    return () => {
      if (autoRotateTimerRef.current) {
        clearTimeout(autoRotateTimerRef.current)
      }
    }
  }, [activeIndex, isPaused])

  // Navigation functions
  const goToBanner = (index: number) => {
    if (index === activeIndex || isAnimating) return

    // Clear any existing timers
    if (autoRotateTimerRef.current) {
      clearTimeout(autoRotateTimerRef.current)
    }

    setDirection(index > activeIndex ? "next" : "prev")
    setIsAnimating(true)

    // Wait for animation to complete
    setTimeout(() => {
      setActiveIndex(index)
      setIsAnimating(false)
    }, 800)
  }

  const goToNextBanner = () => {
    const nextIndex = (activeIndex + 1) % bannerItems.length
    setDirection("next")
    goToBanner(nextIndex)
  }

  const goToPrevBanner = () => {
    const prevIndex = (activeIndex - 1 + bannerItems.length) % bannerItems.length
    setDirection("prev")
    goToBanner(prevIndex)
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main banner container */}
      <div ref={sliderRef} className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
        {/* Slider track */}
        <div
          className={cn(
            "flex transition-transform duration-800 ease-in-out h-full",
            isAnimating && direction === "next" ? "-translate-x-[100%]" : "",
            isAnimating && direction === "prev" ? "translate-x-[100%]" : "",
          )}
          style={{
            width: `${bannerItems.length * 100}%`,
            transform: isAnimating ? "" : `translateX(-${(activeIndex * 100) / bannerItems.length}%)`,
          }}
        >
          {/* Slides */}
          {bannerItems.map((item, index) => (
            <div key={item.id} className="relative h-full" style={{ width: `${100 / bannerItems.length}%` }}>
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                priority={index === 0}
                className="object-cover"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

              {/* Text content with animations */}
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-3xl">
                <div className="overflow-hidden mb-4">
                  <h2
                    className={cn(
                      "text-3xl md:text-4xl lg:text-5xl font-bold text-white transition-all duration-800 delay-100",
                      index === activeIndex && !isAnimating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8",
                    )}
                  >
                    {item.title}
                  </h2>
                </div>

                <div
                  className={cn(
                    "w-20 h-1 bg-[#D40F14] mb-6 transition-all duration-800 delay-200 origin-left",
                    index === activeIndex && !isAnimating ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
                  )}
                />

                <div className="overflow-hidden mb-8">
                  <p
                    className={cn(
                      "text-lg md:text-xl text-white/90 transition-all duration-800 delay-300",
                      index === activeIndex && !isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                    )}
                  >
                    {item.description}
                  </p>
                </div>

                <div>
                  <a
                    href={item.ctaLink}
                    className={cn(
                      "inline-block bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-6 rounded-full transition-all duration-800 delay-400",
                      index === activeIndex && !isAnimating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8",
                    )}
                  >
                    {item.ctaText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="absolute bottom-8 right-8 flex items-center gap-4 z-30">
          <button
            onClick={goToPrevBanner}
            className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white rounded-full p-2 transition-all duration-300 hover:scale-110 border border-white/10"
            aria-label="Previous slide"
            disabled={isAnimating}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToNextBanner}
            className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white rounded-full p-2 transition-all duration-300 hover:scale-110 border border-white/10"
            aria-label="Next slide"
            disabled={isAnimating}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Banner navigation dots */}
      <div className="absolute bottom-8 left-8 flex items-center gap-3 z-30">
        {bannerItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToBanner(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              index === activeIndex ? "bg-white" : "bg-white/30 hover:bg-white/50",
            )}
            aria-label={`Go to slide ${index + 1}`}
            disabled={isAnimating}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-30">
        <div
          className="h-full bg-[#D40F14] transition-all duration-[7000ms] ease-linear w-0"
          style={{
            width: isPaused ? "0%" : "100%",
            transitionDuration: isPaused ? "0ms" : `${slideIntervalMs}ms`,
          }}
        />
      </div>
    </section>
  )
}

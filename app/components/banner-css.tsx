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

export default function BannerCSS() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progress, setProgress] = useState(0)

  const autoRotateTimerRef = useRef<NodeJS.Timeout>()
  const progressIntervalRef = useRef<NodeJS.Timeout>()
  const slideIntervalMs = 4000 // 4 seconds per slide

  // Auto-rotate banners and update progress
  useEffect(() => {
    if (isPaused || isTransitioning) {
      if (autoRotateTimerRef.current) {
        clearTimeout(autoRotateTimerRef.current)
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      return
    }

    // Reset progress
    setProgress(0)

    // Set up auto-rotation
    autoRotateTimerRef.current = setTimeout(() => {
      goToNextBanner()
    }, slideIntervalMs)

    // Update progress bar
    const updateInterval = 30 // Update every 30ms for smooth progress
    const incrementAmount = (updateInterval / slideIntervalMs) * 100

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + incrementAmount
        return newProgress > 100 ? 100 : newProgress
      })
    }, updateInterval)

    return () => {
      if (autoRotateTimerRef.current) {
        clearTimeout(autoRotateTimerRef.current)
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [activeIndex, isPaused, isTransitioning])

  // Navigation functions
  const goToBanner = (index: number) => {
    if (index === activeIndex || isTransitioning) return

    // Clear any existing timers
    if (autoRotateTimerRef.current) {
      clearTimeout(autoRotateTimerRef.current)
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    setIsTransitioning(true)

    // Wait for animation to complete
    setTimeout(() => {
      setActiveIndex(index)
      setIsTransitioning(false)
      setProgress(0)
    }, 800)
  }

  const goToNextBanner = () => {
    const next = (activeIndex + 1) % bannerItems.length
    goToBanner(next)
  }

  const goToPrevBanner = () => {
    const prev = (activeIndex - 1 + bannerItems.length) % bannerItems.length
    goToBanner(prev)
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main banner container */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
        {/* Slider container */}
        <div
          className={cn(
            "absolute flex h-full w-full transition-transform duration-800 ease-in-out",
            isTransitioning ? "pointer-events-none" : "",
          )}
          style={{
            width: `${bannerItems.length * 100}%`,
            transform: `translateX(-${(activeIndex * 100) / bannerItems.length}%)`,
          }}
        >
          {/* Banner items */}
          {bannerItems.map((item, index) => (
            <div key={item.id} className="relative h-full" style={{ width: `${100 / bannerItems.length}%` }}>
              {/* Background image with continuous movement */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-0 w-[110%] h-full",
                    index === activeIndex && !isPaused ? "animate-slow-pan" : "",
                  )}
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    priority={index === 0}
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

              {/* Text content */}
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-3xl">
                <div className="overflow-hidden mb-4">
                  <h2
                    className={cn(
                      "text-3xl md:text-4xl lg:text-5xl font-bold text-white",
                      index === activeIndex ? "animate-fade-in-up" : "opacity-0",
                    )}
                    style={{ animationDelay: "0.1s" }}
                  >
                    {item.title}
                  </h2>
                </div>

                <div
                  className={cn(
                    "w-20 h-1 bg-[#D40F14] mb-6 origin-left",
                    index === activeIndex ? "animate-scale-in" : "opacity-0 scale-x-0",
                  )}
                  style={{ animationDelay: "0.3s" }}
                />

                <div className="overflow-hidden mb-8">
                  <p
                    className={cn(
                      "text-lg md:text-xl text-white/90",
                      index === activeIndex ? "animate-fade-in-up" : "opacity-0",
                    )}
                    style={{ animationDelay: "0.5s" }}
                  >
                    {item.description}
                  </p>
                </div>

                <div>
                  <a
                    href={item.ctaLink}
                    className={cn(
                      "inline-block bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-6 rounded-full",
                      index === activeIndex ? "animate-fade-in-up" : "opacity-0",
                    )}
                    style={{ animationDelay: "0.7s" }}
                  >
                    {item.ctaText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transition overlay */}
        {isTransitioning && <div className="absolute inset-0 bg-[#D40F14]/20 z-20 animate-fade-in-out" />}

        {/* Navigation arrows */}
        <div className="absolute bottom-8 right-8 flex items-center gap-4 z-30">
          <button
            onClick={goToPrevBanner}
            className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white rounded-full p-2 transition-all duration-300 hover:scale-110 border border-white/10"
            aria-label="Previous slide"
            disabled={isTransitioning}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToNextBanner}
            className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white rounded-full p-2 transition-all duration-300 hover:scale-110 border border-white/10"
            aria-label="Next slide"
            disabled={isTransitioning}
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
            disabled={isTransitioning}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-30">
        <div
          className="h-full bg-[#D40F14]"
          style={{
            width: `${progress}%`,
            transition: isPaused ? "none" : "width 30ms linear",
          }}
        />
      </div>
    </section>
  )
}

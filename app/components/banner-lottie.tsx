"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Lottie from "lottie-react"
import slideTransition from "./lottie/slide-transition.json"

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

export default function BannerLottie() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progress, setProgress] = useState(0)

  const autoRotateTimerRef = useRef<NodeJS.Timeout>()
  const progressIntervalRef = useRef<NodeJS.Timeout>()
  const slideIntervalMs = 4000 // 4 seconds per slide
  const lottieRef = useRef<any>(null)

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

    // Play Lottie animation
    if (lottieRef.current) {
      lottieRef.current.play()
    }

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

  // CSS animation classes for text elements
  const getTextAnimationClasses = (index: number) => {
    if (index !== activeIndex) return "opacity-0"
    return "animate-fade-in-up"
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main banner container */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
        {/* Current slide */}
        <div className="absolute inset-0">
          <Image
            src={bannerItems[activeIndex].image || "/placeholder.svg"}
            alt={bannerItems[activeIndex].title}
            fill
            priority
            className="object-cover animate-slow-pan"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

          {/* Text content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-3xl">
            <div className="overflow-hidden mb-4">
              <h2
                className={cn(
                  "text-3xl md:text-4xl lg:text-5xl font-bold text-white transition-all duration-1000 delay-100",
                  getTextAnimationClasses(activeIndex),
                )}
              >
                {bannerItems[activeIndex].title}
              </h2>
            </div>

            <div
              className={cn(
                "w-20 h-1 bg-[#D40F14] mb-6 transition-all duration-1000 delay-300 origin-left",
                activeIndex === activeIndex ? "animate-scale-in" : "scale-x-0 opacity-0",
              )}
            />

            <div className="overflow-hidden mb-8">
              <p
                className={cn(
                  "text-lg md:text-xl text-white/90 transition-all duration-1000 delay-500",
                  getTextAnimationClasses(activeIndex),
                )}
              >
                {bannerItems[activeIndex].description}
              </p>
            </div>

            <div>
              <a
                href={bannerItems[activeIndex].ctaLink}
                className={cn(
                  "inline-block bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-6 rounded-full transition-all duration-1000 delay-700",
                  getTextAnimationClasses(activeIndex),
                )}
              >
                {bannerItems[activeIndex].ctaText}
              </a>
            </div>
          </div>
        </div>

        {/* Lottie transition animation */}
        {isTransitioning && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <Lottie ref={lottieRef} animationData={slideTransition} loop={false} autoplay={true} />
          </div>
        )}

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

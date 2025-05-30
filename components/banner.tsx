"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Banner data with images and text
const bannerItems = [
  {
    id: 1,
    image: "/images/banner-1.png",
    title: "Empowering Individuals",
    description: "Building confidence through personalised coaching in an engaging, inclusive environment",
    ctaText: "Learn More",
    ctaLink: "/about",
  },
  {
    id: 2,
    image: "/images/workshop-training.jpg",
    title: "Presence-Driven Learning - You Show Up. You Shift. That's the Deal.",
    description: "No recordings. No passive downloads. No distractions.",
    ctaText: "Explore Workshops",
    ctaLink: "/workshops",
  },
]

export default function Banner() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const autoRotateTimerRef = useRef<NodeJS.Timeout>()
  const progressIntervalRef = useRef<NodeJS.Timeout>()
  const slideIntervalMs = 5000 // 5 seconds per slide

  // Auto-rotate banners and update progress
  useEffect(() => {
    if (isPaused) {
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
    const updateInterval = 50 // Update every 50ms for smooth progress
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
  }, [activeIndex, isPaused])

  // Navigation functions
  const goToBanner = (index: number) => {
    if (index === activeIndex) return

    // Clear any existing timers
    if (autoRotateTimerRef.current) {
      clearTimeout(autoRotateTimerRef.current)
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    setActiveIndex(index)
    setProgress(0)
  }

  const goToNextBanner = () => {
    const next = (activeIndex + 1) % bannerItems.length
    goToBanner(next)
  }

  const goToPrevBanner = () => {
    const prev = (activeIndex - 1 + bannerItems.length) % bannerItems.length
    goToBanner(prev)
  }

  // Fallback image handling
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement
    target.src = "/placeholder.svg?height=600&width=1200"
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main banner container */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
        {/* Current slide */}
        <div className="absolute inset-0 transition-opacity duration-1000">
          <Image
            src={bannerItems[activeIndex].image || "/placeholder.svg"}
            alt={bannerItems[activeIndex].title}
            fill
            priority
            className="object-cover"
            onError={handleImageError}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

          {/* Text content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-3xl">
            <div className="mb-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                {bannerItems[activeIndex].title}
              </h2>
            </div>

            <div className="w-20 h-1 bg-[#D40F14] mb-6" />

            <div className="mb-8">
              <p className="text-lg md:text-xl text-white/90">{bannerItems[activeIndex].description}</p>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="absolute bottom-8 right-8 flex items-center gap-4 z-30">
          <button
            onClick={goToPrevBanner}
            className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white rounded-full p-2 transition-all duration-300 hover:scale-110 border border-white/10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToNextBanner}
            className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white rounded-full p-2 transition-all duration-300 hover:scale-110 border border-white/10"
            aria-label="Next slide"
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
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-30">
        <div
          className="h-full bg-[#D40F14]"
          style={{
            width: `${progress}%`,
            transition: isPaused ? "none" : "width 50ms linear",
          }}
        />
      </div>
    </section>
  )
}

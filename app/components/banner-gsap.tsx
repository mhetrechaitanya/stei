"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import gsap from "gsap"

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

export default function BannerGSAP() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const bannerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const progressTimeline = useRef<gsap.core.Timeline | null>(null)
  const slideIntervalMs = 4000 // 4 seconds per slide

  // Initialize GSAP animations
  useEffect(() => {
    // Create a GSAP context for clean up
    const ctx = gsap.context(() => {
      // Set initial positions
      gsap.set(sliderRef.current, {
        x: `-${activeIndex * 100}%`,
      })

      // Set up image continuous movement for all slides
      imageRefs.current.forEach((img) => {
        if (img) {
          gsap.to(img, {
            xPercent: -5,
            duration: 8,
            ease: "none",
            repeat: -1,
            yoyo: true,
          })
        }
      })

      // Animate initial slide content
      animateSlideContent(activeIndex)
    }, bannerRef)

    return () => ctx.revert() // Clean up animations
  }, [])

  // Auto-rotate banners
  useEffect(() => {
    if (isPaused || isTransitioning) {
      if (progressTimeline.current) {
        progressTimeline.current.pause()
      }
      return
    }

    // Reset and start progress animation
    if (progressRef.current) {
      if (progressTimeline.current) {
        progressTimeline.current.kill()
      }

      progressTimeline.current = gsap.timeline({
        onComplete: () => goToNextBanner(),
      })

      progressTimeline.current.fromTo(
        progressRef.current,
        { width: "0%" },
        { width: "100%", duration: slideIntervalMs / 1000, ease: "none" },
      )
    }

    return () => {
      if (progressTimeline.current) {
        progressTimeline.current.kill()
      }
    }
  }, [activeIndex, isPaused, isTransitioning])

  // Animate slide content
  const animateSlideContent = (index: number) => {
    const title = titleRefs.current[index]
    const line = lineRefs.current[index]
    const desc = descRefs.current[index]
    const button = buttonRefs.current[index]

    const tl = gsap.timeline()

    if (title) {
      tl.fromTo(title, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0)
    }

    if (line) {
      tl.fromTo(line, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.2)
    }

    if (desc) {
      tl.fromTo(desc, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.4)
    }

    if (button) {
      tl.fromTo(button, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.6)
    }

    return tl
  }

  // Navigation functions
  const goToBanner = (index: number) => {
    if (index === activeIndex || isTransitioning) return

    setIsTransitioning(true)

    // Kill any existing progress animation
    if (progressTimeline.current) {
      progressTimeline.current.kill()
    }

    // Reset progress bar
    if (progressRef.current) {
      gsap.set(progressRef.current, { width: "0%" })
    }

    // Create a timeline for the transition
    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(index)
        setIsTransitioning(false)
        animateSlideContent(index)
      },
    })

    // Fade out current slide content
    const currentTitle = titleRefs.current[activeIndex]
    const currentLine = lineRefs.current[activeIndex]
    const currentDesc = descRefs.current[activeIndex]
    const currentButton = buttonRefs.current[activeIndex]

    tl.to([currentTitle, currentLine, currentDesc, currentButton], {
      opacity: 0,
      y: -20,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.in",
    })

    // Animate slider to new position
    tl.to(
      sliderRef.current,
      {
        x: `-${index * 100}%`,
        duration: 0.8,
        ease: "power2.inOut",
      },
      "-=0.2",
    )

    // Add a wipe effect
    const overlay = document.createElement("div")
    overlay.style.position = "absolute"
    overlay.style.top = "0"
    overlay.style.left = "0"
    overlay.style.width = "100%"
    overlay.style.height = "100%"
    overlay.style.backgroundColor = "#D40F14"
    overlay.style.opacity = "0"
    overlay.style.zIndex = "15"
    overlay.style.pointerEvents = "none"

    if (bannerRef.current) {
      bannerRef.current.appendChild(overlay)

      tl.to(
        overlay,
        {
          opacity: 0.3,
          duration: 0.4,
          ease: "power2.in",
        },
        "-=0.8",
      )

      tl.to(
        overlay,
        {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            if (bannerRef.current && bannerRef.current.contains(overlay)) {
              bannerRef.current.removeChild(overlay)
            }
          },
        },
        "-=0.2",
      )
    }
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
      ref={bannerRef}
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main banner container */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
        {/* Slider container */}
        <div ref={sliderRef} className="absolute flex h-full w-full" style={{ width: `${bannerItems.length * 100}%` }}>
          {/* Banner items */}
          {bannerItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (slideRefs.current[index] = el)}
              className="relative h-full"
              style={{ width: `${100 / bannerItems.length}%` }}
            >
              {/* Background image with continuous movement */}
              <div className="absolute inset-0 overflow-hidden">
                <div ref={(el) => (imageRefs.current[index] = el)} className="absolute inset-0 w-[110%] h-full">
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
                    ref={(el) => (titleRefs.current[index] = el)}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white opacity-0"
                  >
                    {item.title}
                  </h2>
                </div>

                <div
                  ref={(el) => (lineRefs.current[index] = el)}
                  className="w-20 h-1 bg-[#D40F14] mb-6 origin-left opacity-0"
                />

                <div className="overflow-hidden mb-8">
                  <p
                    ref={(el) => (descRefs.current[index] = el)}
                    className="text-lg md:text-xl text-white/90 opacity-0"
                  >
                    {item.description}
                  </p>
                </div>

                <div>
                  <a
                    ref={(el) => (buttonRefs.current[index] = el)}
                    href={item.ctaLink}
                    className="inline-block bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-6 rounded-full opacity-0"
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
        <div ref={progressRef} className="h-full bg-[#D40F14]" />
      </div>
    </section>
  )
}

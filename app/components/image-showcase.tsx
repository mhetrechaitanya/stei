"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Image showcase data
const showcaseItems = [
  {
    id: 1,
    image: "/placeholder.svg?height=800&width=1200",
    title: "Empowering Individuals",
    description:
      "Building confidence through personalised coaching and mentorship programs designed to help you reach your full potential.",
    ctaText: "Learn More",
    ctaLink: "/about",
    featured: true,
  },
  {
    id: 2,
    image: "/placeholder.svg?height=600&width=800",
    title: "Interactive Workshops",
    description: "Develop essential skills for personal and professional growth",
    ctaText: "Explore Workshops",
    ctaLink: "/products-services#workshops",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=600&width=800",
    title: "iACE Interview Skills",
    description: "Our flagship workshop for interview excellence",
    ctaText: "Get Started",
    ctaLink: "/products-services#iace-interviews",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=600&width=800",
    title: "Transform Your Future",
    description: "Join our community of successful professionals",
    ctaText: "See Testimonials",
    ctaLink: "/impressions",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=600&width=800",
    title: "personalised Coaching",
    description: "One-on-one sessions tailored to your needs",
    ctaText: "Book a Session",
    ctaLink: "/products-services#coaching",
  },
]

export default function ImageShowcase() {
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})
  const [animated, setAnimated] = useState<Record<number, boolean>>({})

  // Handle image load
  const handleImageLoad = (id: number) => {
    setLoaded((prev) => ({
      ...prev,
      [id]: true,
    }))

    // Start text animation after a short delay
    setTimeout(
      () => {
        setAnimated((prev) => ({
          ...prev,
          [id]: true,
        }))
      },
      300 + id * 100,
    ) // Stagger animations
  }

  // Initialize all animations after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const allLoaded: Record<number, boolean> = {}

      showcaseItems.forEach((item) => {
        allLoaded[item.id] = true
      })

      setLoaded(allLoaded)

      // Stagger the animations
      showcaseItems.forEach((item, index) => {
        setTimeout(
          () => {
            setAnimated((prev) => ({
              ...prev,
              [item.id]: true,
            }))
          },
          300 + index * 150,
        )
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Separate featured item from regular items
  const featuredItem = showcaseItems.find((item) => item.featured)
  const regularItems = showcaseItems.filter((item) => !item.featured)

  return (
    <section className="w-full bg-black">
      {/* Featured item - full width */}
      {featuredItem && (
        <div className="relative h-[500px] md:h-[600px] overflow-hidden group">
          {/* Background image */}
          <Image
            src={featuredItem.image || "/placeholder.svg"}
            alt={featuredItem.title}
            fill
            priority
            className={cn(
              "object-cover transition-all duration-1000 ease-out",
              loaded[featuredItem.id] ? "opacity-100 scale-100" : "opacity-0 scale-110",
            )}
            onLoadingComplete={() => handleImageLoad(featuredItem.id)}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          {/* Text content */}
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 lg:p-24 max-w-3xl">
            <h2
              className={cn(
                "text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 transition-all duration-700 ease-out",
                animated[featuredItem.id] ? "opacity-100 transform-none" : "opacity-0 -translate-x-10",
              )}
            >
              {featuredItem.title}
            </h2>

            <div
              className={cn(
                "w-20 h-1 bg-[#D40F14] mb-6 transition-all duration-700 ease-out delay-100",
                animated[featuredItem.id] ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
              )}
            />

            <p
              className={cn(
                "text-lg md:text-xl text-white/90 mb-8 max-w-xl transition-all duration-700 ease-out delay-200",
                animated[featuredItem.id] ? "opacity-100 transform-none" : "opacity-0 -translate-x-10",
              )}
            >
              {featuredItem.description}
            </p>

            <a
              href={featuredItem.ctaLink}
              className={cn(
                "inline-block bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-6 rounded-full transition-all duration-700 ease-out delay-300",
                animated[featuredItem.id] ? "opacity-100 transform-none" : "opacity-0 -translate-y-10",
              )}
            >
              {featuredItem.ctaText}
            </a>
          </div>
        </div>
      )}

      {/* Regular items - grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {regularItems.map((item) => (
          <div key={item.id} className="relative h-[300px] md:h-[350px] overflow-hidden group">
            {/* Background image */}
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              fill
              className={cn(
                "object-cover transition-all duration-700 group-hover:scale-110",
                loaded[item.id] ? "opacity-100" : "opacity-0 scale-110",
              )}
              onLoadingComplete={() => handleImageLoad(item.id)}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

            {/* Text content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <h3
                className={cn(
                  "text-xl md:text-2xl font-bold text-white mb-2 transition-all duration-500 ease-out",
                  animated[item.id] ? "opacity-100 transform-none" : "opacity-0 translate-y-4",
                )}
              >
                {item.title}
              </h3>

              <div
                className={cn(
                  "w-12 h-0.5 bg-[#D40F14] mb-3 transition-all duration-500 ease-out delay-100",
                  animated[item.id] ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
                )}
              />

              <p
                className={cn(
                  "text-sm md:text-base text-white/80 mb-4 line-clamp-2 transition-all duration-500 ease-out delay-200",
                  animated[item.id] ? "opacity-100 transform-none" : "opacity-0 translate-y-4",
                )}
              >
                {item.description}
              </p>

              <a
                href={item.ctaLink}
                className={cn(
                  "inline-block text-sm font-medium text-white hover:text-[#D40F14] transition-all duration-500 ease-out delay-300",
                  animated[item.id] ? "opacity-100 transform-none" : "opacity-0 translate-y-4",
                )}
              >
                {item.ctaText} →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

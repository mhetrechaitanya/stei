"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Image grid data
const gridItems = [
  {
    id: 1,
    image: "/placeholder.svg?height=600&width=800",
    title: "Empowering Individuals",
    description: "Building confidence through personalised coaching",
    ctaText: "Learn More",
    ctaLink: "/about",
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
]

export default function ImageGrid() {
  // Ensure gridItems exists and has items
  const items = gridItems && gridItems.length > 0 ? gridItems : []

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
      const allAnimated: Record<number, boolean> = {}

      items.forEach((item, index) => {
        allLoaded[item.id] = true

        // Stagger the animations
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

      setLoaded(allLoaded)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="w-full bg-black">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="relative h-[300px] md:h-[400px] overflow-hidden group">
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

"use client"

import Image from "next/image"

interface TestimonialCardProps {
  name: string
  role?: string
  image?: string
  quote: string
  year?: string
  featured?: boolean
  onReadMore?: () => void
}

export default function TestimonialCard({
  name,
  role,
  image = "/images/testimonials/default-avatar.jpg", // Update default image path
  quote,
  year,
  featured = false,
  onReadMore,
}: TestimonialCardProps) {
  // Truncate quote if it's too long and there's a read more function
  // Modify the shouldTruncate logic to ensure Salman's testimonial gets truncated
  const shouldTruncate = quote.length > 250 && onReadMore
  const truncatedQuote = shouldTruncate ? `${quote.substring(0, 250)}...` : quote

  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 relative ${featured ? "border-2 border-[#D40F14]" : ""}`}>
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <div
          className={`w-24 h-24 rounded-full overflow-hidden border-4 ${featured ? "border-[#D40F14]" : "border-white"} shadow-md`}
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
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
        <p className="text-gray-700 mb-4">"{truncatedQuote}"</p>

        {shouldTruncate && (
          <button onClick={onReadMore} className="text-[#D40F14] font-medium hover:underline mt-2">
            Read More
          </button>
        )}

        <h4 className="text-lg font-bold text-gray-800 mt-4">{name}</h4>
        {role && <p className="text-[#D40F14]">{role}</p>}
        {year && <p className="text-gray-500 text-sm mt-1">({year})</p>}

        {featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-[#D40F14] text-white text-xs px-2 py-1 rounded-full">Featured</span>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import Image from "next/image"
import { Star } from "lucide-react"

interface ParticipantCardProps {
  name: string
  role: string
  company: string
  image: string
  experience: string
  workshop: string
  rating: number
  date: string
  featured?: boolean
  onClick?: () => void
}

export default function ParticipantCard({
  name,
  role,
  company,
  image,
  experience,
  workshop,
  rating,
  date,
  featured = false,
  onClick,
}: ParticipantCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col relative">
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-[#D40F14] text-white text-xs px-2 py-1 rounded-full">Featured</span>
        </div>
      )}

      <div className="p-6 flex-grow">
        <div className="flex items-center mb-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-[#D40F14] mr-4">
            <Image
              src={image || "/placeholder.svg?height=64&width=64"}
              alt={name}
              width={64}
              height={64}
              className="object-cover"
              priority={featured}
              onError={(e) => {
                // @ts-ignore - fallback to placeholder on error
                e.target.src = "/placeholder.svg?height=64&width=64"
              }}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{name}</h3>
            <p className="text-[#D40F14]">{role}</p>
            <p className="text-sm text-gray-600">{company}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
            ))}
            <span className="ml-2 text-sm text-gray-600">{date}</span>
          </div>
          <div className="text-sm text-gray-500">
            Workshop: <span className="font-medium">{workshop}</span>
          </div>
        </div>

        <p className="text-gray-700 line-clamp-4 mb-4">{experience}</p>
      </div>

      {onClick && (
        <div className="p-6 pt-0">
          <button onClick={onClick} className="text-[#D40F14] font-medium hover:underline flex items-center">
            Read Full Experience
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

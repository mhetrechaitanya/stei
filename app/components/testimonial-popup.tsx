"use client"

import { useEffect } from "react"
import Image from "next/image"

interface TestimonialPopupProps {
  name: string
  role?: string
  image?: string
  fullText: string
  onClose: () => void
}

export default function TestimonialPopup({
  name,
  role,
  image = "/images/testimonials/default-avatar.jpg",
  fullText,
  onClose,
}: TestimonialPopupProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscKey)

    // Prevent scrolling on the body
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D40F14]">
                <Image
                  src={image || "/images/testimonials/default-avatar.jpg"}
                  alt={name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{name}</h3>
                {role && <p className="text-[#D40F14]">{role}</p>}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
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
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{fullText}</p>
          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-[#D40F14] text-white px-6 py-2 rounded-full hover:bg-[#B00D11] transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

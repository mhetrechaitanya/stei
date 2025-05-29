"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface BannerThumbnailProps {
  src: string
  alt: string
  isActive: boolean
  onClick: () => void
}

export default function BannerThumbnail({ src, alt, isActive, onClick }: BannerThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative h-16 w-24 overflow-hidden rounded-md transition-all duration-500",
        isActive ? "ring-2 ring-[#D40F14] scale-110 z-10" : "opacity-70 hover:opacity-100 hover:scale-105",
      )}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className={cn("object-cover transition-all duration-500", isActive && "scale-110")}
      />
      {isActive && <div className="absolute inset-0 bg-[#D40F14]/20 animate-shimmer" />}
    </button>
  )
}

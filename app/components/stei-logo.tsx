"use client"

import { cn } from "@/lib/utils"

interface SteiLogoProps {
  className?: string
  textColor?: string
  accentColor?: string
}

export default function SteiLogo({
  className = "",
  textColor = "text-black",
  accentColor = "text-[#900000]",
}: SteiLogoProps) {
  return (
    <h2 className={cn("stei-logo font-bold flex items-center", className)} style={{ textTransform: "lowercase" }}>
      <span className="font-serif flex items-baseline inline-flex">
        <span className={textColor} style={{ textTransform: "lowercase" }}>
          s
        </span>
        <span className={cn(textColor, "text-[3.25em] leading-none")} style={{ textTransform: "lowercase" }}>
          t
        </span>
        <span className={textColor} style={{ textTransform: "lowercase" }}>
          e
        </span>
        <span className={accentColor} style={{ textTransform: "lowercase" }}>
          i
        </span>
      </span>
    </h2>
  )
}

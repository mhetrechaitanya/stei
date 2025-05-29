"use client"

import Image from "next/image"
import { useState } from "react"

interface FallbackImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  fill?: boolean
}

export default function FallbackImage({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackSrc = "/placeholder.svg",
  fill = false,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      console.log(`Image failed to load: ${src}, using fallback`)
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  // Add dimensions to fallback if not using fill
  let fallbackWithDimensions = fallbackSrc
  if (!fill && width && height) {
    fallbackWithDimensions = `${fallbackSrc}?height=${height}&width=${width}`
  }

  return (
    <Image
      src={hasError ? fallbackWithDimensions : imgSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      fill={fill}
      onError={handleError}
      {...props}
    />
  )
}

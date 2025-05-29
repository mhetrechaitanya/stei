"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Image from "next/image"
import { uploadFile } from "@/lib/storage-service"
import { Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EnhancedImageUploadProps {
  onImageUploaded: (imageUrl: string) => void
  initialImage?: string
  bucket: string
  path?: string
  className?: string
  aspectRatio?: "square" | "video" | "wide" | "auto"
  maxSizeMB?: number
  allowedTypes?: string[]
}

export default function EnhancedImageUpload({
  onImageUploaded,
  initialImage,
  bucket,
  path,
  className = "",
  aspectRatio = "square",
  maxSizeMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"],
}: EnhancedImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string>(initialImage || "")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate aspect ratio class
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/9]",
    auto: "aspect-auto",
  }[aspectRatio]

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        setError(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`)
        return
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size exceeds ${maxSizeMB}MB limit`)
        return
      }

      setError(null)
      setIsUploading(true)

      try {
        const result = await uploadFile(file, bucket, {
          path,
          generateUniqueName: true,
          upsert: true,
        })

        if (!result.success || !result.data) {
          throw new Error(result.error || "Upload failed")
        }

        setImageUrl(result.data.url)
        onImageUploaded(result.data.url)
      } catch (err) {
        console.error("Upload error:", err)
        setError("Failed to upload image. Please try again.")
      } finally {
        setIsUploading(false)
      }
    },
    [bucket, path, maxSizeMB, allowedTypes, onImageUploaded],
  )

  const handleRemoveImage = useCallback(() => {
    setImageUrl("")
    onImageUploaded("")
  }, [onImageUploaded])

  return (
    <div className={`relative ${className}`}>
      {imageUrl ? (
        <div className={`relative border rounded-md overflow-hidden ${aspectRatioClass}`}>
          <Image src={imageUrl || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 ${aspectRatioClass}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center p-6 text-gray-500">
              <Loader2 className="h-10 w-10 animate-spin mb-2" />
              <p>Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center p-6 text-gray-500">
              <Upload className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Click to upload image</p>
              <p className="text-xs mt-1">
                {allowedTypes.map((type) => type.split("/")[1]).join(", ")} up to {maxSizeMB}MB
              </p>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            accept={allowedTypes.join(",")}
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

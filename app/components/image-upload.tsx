"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  maxSizeMB?: number
}

export default function ImageUpload({ onImageUploaded, maxSizeMB = 5 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxSizeBytes = maxSizeMB * 1024 * 1024 // Convert MB to bytes

  // Create a lightweight preview without full upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    if (file.size > maxSizeBytes) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: "destructive",
      })
      return
    }

    // Create a local preview immediately
    const localPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(localPreviewUrl)

    // Auto upload when file is selected
    uploadImage(file)
  }

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true)

      // Create form data
      const formData = new FormData()
      formData.append("file", file)

      // Send to our API route
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()

      // Call the callback with the URL
      onImageUploaded(data.url)

      toast({
        title: "Upload successful",
        description: "Your image has been uploaded",
      })
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)

      // Clean up the local preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          id="image-upload"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full h-12"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Select Image
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-gray-500">Maximum file size: {maxSizeMB}MB. Supported formats: JPG, PNG, GIF.</p>
    </div>
  )
}

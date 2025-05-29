"use server"

import { getSupabaseServer } from "./supabase-server"
import { v4 as uuidv4 } from "uuid"
import { STORAGE_BUCKETS } from "./storage-constants"

// Initialize storage buckets
export async function initializeStorageBuckets() {
  try {
    const supabase = await getSupabaseServer()

    // Create each bucket if it doesn't exist
    for (const bucket of Object.values(STORAGE_BUCKETS)) {
      const { data, error } = await supabase.storage.getBucket(bucket)

      if (error && error.message.includes("The resource was not found")) {
        console.log(`Creating storage bucket: ${bucket}`)
        await supabase.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"],
        })
      }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error initializing storage buckets:", error)
    return { success: false, error: error.message }
  }
}

// Upload a file to a specific bucket
export async function uploadFile(
  file: File,
  bucket: string,
  options?: {
    path?: string
    upsert?: boolean
    generateUniqueName?: boolean
  },
) {
  try {
    const supabase = await getSupabaseServer()

    // Generate a unique file name if requested
    let fileName = file.name
    if (options?.generateUniqueName) {
      const fileExt = file.name.split(".").pop()
      fileName = `${uuidv4().replace(/-/g, "")}_${Date.now()}.${fileExt}`
    }

    // Determine the full path
    const filePath = options?.path ? `${options.path}/${fileName}` : fileName

    // Upload the file
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      upsert: options?.upsert ?? false,
      contentType: file.type,
    })

    if (error) throw error

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return {
      success: true,
      data: {
        path: data.path,
        url: publicUrl,
        fileName: fileName,
        size: file.size,
        type: file.type,
      },
      error: null,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { success: false, data: null, error: error.message }
  }
}

// Delete a file from a bucket
export async function deleteFile(path: string, bucket: string) {
  try {
    const supabase = await getSupabaseServer()

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting file:", error)
    return { success: false, error: error.message }
  }
}

// List files in a bucket/folder
export async function listFiles(bucket: string, path?: string) {
  try {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase.storage.from(bucket).list(path || "")

    if (error) throw error

    // Add public URLs to each file
    const filesWithUrls = data.map((file) => {
      if (!file.id) return file

      const filePath = path ? `${path}/${file.name}` : file.name
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath)

      return {
        ...file,
        url: publicUrl,
      }
    })

    return { success: true, data: filesWithUrls, error: null }
  } catch (error) {
    console.error("Error listing files:", error)
    return { success: false, data: null, error: error.message }
  }
}

// Get a public URL for a file
export async function getPublicUrl(path: string, bucket: string) {
  try {
    const supabase = await getSupabaseServer()

    // Check if the file exists first
    const { data: fileData, error: fileError } = await supabase.storage.from(bucket).download(path)

    if (fileError) {
      console.warn(`File not found at path: ${path} in bucket: ${bucket}`, fileError)
      return {
        success: false,
        url: null,
        error: fileError.message,
        fallbackUrl: "/placeholder.svg?height=400&width=300",
      }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path)

    return { success: true, url: publicUrl, error: null }
  } catch (error) {
    console.error("Error getting public URL:", error)
    return {
      success: false,
      url: null,
      error: error.message,
      fallbackUrl: "/placeholder.svg?height=400&width=300",
    }
  }
}

// Create a folder in a bucket
export async function createFolder(bucket: string, path: string) {
  try {
    const supabase = await getSupabaseServer()

    // Create an empty file to represent the folder
    const { error } = await supabase.storage.from(bucket).upload(`${path}/.folder`, new Blob([]), { upsert: true })

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    console.error("Error creating folder:", error)
    return { success: false, error: error.message }
  }
}

// Helper function to get bucket names
export async function getStorageBuckets() {
  return STORAGE_BUCKETS
}

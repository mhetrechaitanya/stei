import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import sharp from "sharp"
import fetch from "node-fetch"

export async function POST(request: Request) {
  try {
    const { pdfUrl, outputFileName } = await request.json()

    if (!pdfUrl) {
      return NextResponse.json({ error: "PDF URL is required" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Fetch the PDF file
    const response = await fetch(pdfUrl)
    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch PDF: ${response.statusText}` }, { status: 500 })
    }

    // Convert PDF to image using a PDF rendering service
    // For this example, we'll assume the PDF is already an image
    // In a real implementation, you would use a PDF library or service
    const buffer = await response.buffer()

    // Process with sharp (this would work for first page of PDF if it were converted)
    const processedImage = await sharp(buffer).jpeg({ quality: 90 }).toBuffer()

    // Generate a unique filename if not provided
    const fileName = outputFileName || `converted-${Date.now()}.jpg`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("certificates").upload(fileName, processedImage, {
      contentType: "image/jpeg",
      upsert: true,
    })

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("certificates").getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl })
  } catch (error: any) {
    console.error("PDF conversion error:", error)
    return NextResponse.json({ error: error.message || "Failed to convert PDF" }, { status: 500 })
  }
}

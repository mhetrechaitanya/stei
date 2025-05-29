import { NextResponse } from "next/server"
import { getFallbackQuotes } from "@/lib/fallback-quotes"

export async function GET() {
  try {
    // Return fallback quotes directly
    const quotes = getFallbackQuotes(30) // Get 30 quotes for the all quotes page

    return NextResponse.json({
      success: true,
      data: quotes,
      message: "Using fallback quotes",
    })
  } catch (error) {
    console.error("Error in /api/quotes/all:", error)

    // Even if there's an error, return fallback quotes
    return NextResponse.json({
      success: true,
      data: getFallbackQuotes(30),
      message: "Error occurred, using fallback quotes",
      error: String(error),
    })
  }
}

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request, { params }) {
  const { workshopId } = params

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Missing database credentials",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch batches for the workshop
    const { data, error } = await supabase.from("workshop_batches").select("*").eq("workshop_id", workshopId)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch batches",
          details: error.message,
        },
        { status: 500 },
      )
    }

    // Log the data for debugging
    console.log(`Found ${data?.length || 0} batches for workshop ${workshopId}`)

    return NextResponse.json({
      batches: data || [],
      count: data?.length || 0,
    })
  } catch (error) {
    console.error(`Error fetching batches for workshop ${workshopId}:`, error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

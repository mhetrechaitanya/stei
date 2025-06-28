import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
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

    // Fetch all mentors
    const { data, error } = await supabase
      .from("mentors")
      .select("id, name, title, email")
      .order("name", { ascending: true })

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to fetch mentors",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching mentors:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const mentorData = await request.json()

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

    // Validate required fields
    if (!mentorData.name) {
      return NextResponse.json(
        {
          error: "Missing required field",
          details: "Name is required",
        },
        { status: 400 },
      )
    }

    // Insert new mentor
    const { data, error } = await supabase
      .from("mentors")
      .insert({
        name: mentorData.name,
        title: mentorData.title || null,
        bio: mentorData.bio || null,
        image: mentorData.image || null,
        email: mentorData.email || null,
        phone: mentorData.phone || null,
        linkedin_url: mentorData.linkedin_url || null,
      })
      .select()

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to create mentor",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: "Mentor created successfully",
    })
  } catch (error) {
    console.error("Error creating mentor:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
} 
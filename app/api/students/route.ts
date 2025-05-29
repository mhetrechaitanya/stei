import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"
import { TABLES } from "@/lib/supabase-config"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer()

    // Get URL parameters
    const url = new URL(request.url)
    const columns = url.searchParams.get("columns") || "*"

    // Fetch students with proper query formatting
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .select(columns)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching students:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch students",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Unexpected error fetching students:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    // Test connection by trying to fetch a single row from students table
    const { data, error } = await supabase.from("students").select("id").limit(1)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection test failed",
          error: error.message,
          hint: "Check your Supabase credentials and network connectivity",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      tablesAccessible: ["students"],
      recordsFound: data?.length || 0,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Database connection test failed with exception",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

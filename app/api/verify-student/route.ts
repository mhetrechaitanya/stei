import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function POST(request) {
  try {
    const body = await request.json()
    const { type, value } = body

    if (!type || !value) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    // Skip the table existence check and directly try to query the students table
    try {
      // Test if we can access the students table with a simple count query
      const { count, error: countError } = await supabase.from("students").select("*", { count: "exact", head: true })

      if (countError) {
        console.error("Error accessing students table:", countError)
        return NextResponse.json(
          {
            success: false,
            message: "Database error: Cannot access students table",
            error: countError.message,
          },
          { status: 500 },
        )
      }

      // If we get here, the table exists and is accessible
    } catch (error) {
      console.error("Error checking students table:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Database error: " + error.message,
          error: error.message,
        },
        { status: 500 },
      )
    }

    // Now query the students table
    let query = supabase.from("students").select("*")

    if (type === "email") {
      query = query.eq("email", value)
    } else if (type === "phone") {
      query = query.eq("phone", value)
    }

    try {
      const { data, error } = await query.maybeSingle()

      if (error) {
        // Check if it's a column not found error
        if (error.message && error.message.includes("column") && error.message.includes("does not exist")) {
          return NextResponse.json(
            {
              success: false,
              message: "Database structure error: Missing required columns",
              error: error.message,
            },
            { status: 500 },
          )
        }

        console.error("Error querying students:", error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        exists: !!data,
        student: data || null,
      })
    } catch (error) {
      console.error("Unexpected error during verification:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
  } catch (error) {
    console.error("Error parsing request:", error)
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 })
  }
}

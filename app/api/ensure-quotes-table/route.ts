import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Check if the table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "inspiration_quotes")
      .single()

    if (tableCheckError || !tableExists) {
      // Create the table if it doesn't exist
      const { error: createTableError } = await supabase.rpc("create_inspiration_quotes_table")

      if (createTableError) {
        console.error("Error creating inspiration_quotes table:", createTableError)
        return NextResponse.json(
          {
            success: false,
            message: "Failed to create inspiration_quotes table",
            error: createTableError.message,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "inspiration_quotes table created successfully",
      })
    }

    return NextResponse.json({
      success: true,
      message: "inspiration_quotes table already exists",
    })
  } catch (error) {
    console.error("Error in ensure-quotes-table:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while checking/creating the inspiration_quotes table",
        error: String(error),
      },
      { status: 500 },
    )
  }
}

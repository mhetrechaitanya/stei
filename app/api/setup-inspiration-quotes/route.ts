import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Create a Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || ""
    const supabaseKey = process.env.SUPABASE_ANON_KEY || ""

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase credentials not configured",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if the inspiration_quotes table exists
    const { data: tableExists, error: checkError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "inspiration_quotes")
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      return NextResponse.json(
        {
          success: false,
          message: "Error checking if table exists",
          error: checkError,
        },
        { status: 500 },
      )
    }

    // If the table doesn't exist, create it
    if (!tableExists) {
      const { error: createError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE inspiration_quotes (
            id SERIAL PRIMARY KEY,
            quote TEXT NOT NULL,
            author VARCHAR(255) NOT NULL,
            category VARCHAR(100),
            color VARCHAR(50),
            is_featured BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `,
      })

      if (createError) {
        return NextResponse.json(
          {
            success: false,
            message: "Error creating inspiration_quotes table",
            error: createError,
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
    console.error("Error in setup-inspiration-quotes API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: String(error),
      },
      { status: 500 },
    )
  }
}

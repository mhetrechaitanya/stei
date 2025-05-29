import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    // First check if the students table exists
    const { data: tableCheck, error: tableCheckError } = await supabase
      .from("students")
      .select("id")
      .limit(1)
      .maybeSingle()

    if (tableCheckError && tableCheckError.code === "42P01") {
      // Table doesn't exist, create it
      const sqlScript = `
        -- Create extension if it doesn't exist
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        -- Create students table
        CREATE TABLE IF NOT EXISTS students (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT,
          first_name TEXT,
          last_name TEXT,
          email TEXT UNIQUE,
          phone TEXT UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          workshop_id UUID,
          batch_id UUID,
          enrollment_status TEXT DEFAULT 'registered',
          payment_status TEXT DEFAULT 'pending'
        );
        
        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
        CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);
      `

      // Execute the SQL script
      const { error: createError } = await supabase.rpc("exec_sql", { sql: sqlScript })

      if (createError) {
        console.error("Error creating students table:", createError)
        return NextResponse.json(
          {
            success: false,
            message: "Failed to create students table",
            error: createError,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Students table created successfully",
      })
    } else if (tableCheckError) {
      // Some other error occurred
      console.error("Error checking students table:", tableCheckError)
      return NextResponse.json(
        {
          success: false,
          message: "Error checking if students table exists",
          error: tableCheckError,
        },
        { status: 500 },
      )
    }

    // Table already exists
    return NextResponse.json({
      success: true,
      message: "Students table already exists",
      exists: true,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
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

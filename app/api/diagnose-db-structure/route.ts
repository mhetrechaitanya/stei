import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = await getSupabaseServer()
    const diagnostics = {
      connection: false,
      tables: {
        students: {
          exists: false,
          columns: [],
          error: null,
        },
      },
      errors: [],
    }

    // Test connection
    try {
      const { data: connectionTest, error: connectionError } = await supabase
        .from("students")
        .select("count(*)", { count: "exact", head: true })

      if (connectionError && connectionError.code !== "42P01") {
        // If error is not "relation does not exist", then connection works
        diagnostics.connection = true
        diagnostics.errors.push({
          type: "connection_error",
          message: connectionError.message,
          code: connectionError.code,
        })
      } else if (!connectionError) {
        diagnostics.connection = true
        diagnostics.tables.students.exists = true
      }
    } catch (error) {
      diagnostics.errors.push({
        type: "connection_test_failed",
        message: error.message,
      })
    }

    // Check if students table exists
    if (diagnostics.connection) {
      try {
        // Use a direct query to check if the students table exists
        const { count, error: countError } = await supabase.from("students").select("*", { count: "exact", head: true })

        if (countError && countError.code === "42P01") {
          // Error code 42P01 means relation does not exist
          diagnostics.tables.students.exists = false
        } else if (countError) {
          diagnostics.errors.push({
            type: "table_check_error",
            message: countError.message,
            code: countError.code,
          })
        } else {
          diagnostics.tables.students.exists = true
        }
      } catch (error) {
        diagnostics.errors.push({
          type: "table_check_failed",
          message: error.message,
        })
      }

      // If students table exists, check its columns
      if (diagnostics.tables.students.exists) {
        try {
          const { data: columns, error: columnsError } = await supabase
            .from("information_schema.columns")
            .select("column_name, data_type, is_nullable")
            .eq("table_schema", "public")
            .eq("table_name", "students")

          if (columnsError) {
            diagnostics.errors.push({
              type: "columns_check_error",
              message: columnsError.message,
              code: columnsError.code,
            })
          } else {
            diagnostics.tables.students.columns = columns || []
          }
        } catch (error) {
          diagnostics.errors.push({
            type: "columns_check_failed",
            message: error.message,
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      diagnostics,
    })
  } catch (error) {
    console.error("Unexpected error during database diagnostics:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during diagnostics",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

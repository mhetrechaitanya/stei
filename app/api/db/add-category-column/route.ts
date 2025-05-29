import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function POST() {
  try {
    const supabase = await getSupabaseServer()

    // Check if the column already exists
    const { data: columnExists, error: checkError } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", "workshops")
      .eq("column_name", "category")
      .maybeSingle()

    if (checkError) {
      console.error("Error checking if column exists:", checkError)
      return NextResponse.json({ error: "Failed to check if column exists" }, { status: 500 })
    }

    // If the column already exists, return success
    if (columnExists) {
      return NextResponse.json({ message: "Category column already exists" })
    }

    // Add the category column
    const { error } = await supabase.rpc("exec_sql", {
      sql_query: "ALTER TABLE workshops ADD COLUMN category VARCHAR(100)",
    })

    if (error) {
      console.error("Error adding category column:", error)
      return NextResponse.json({ error: "Failed to add category column" }, { status: 500 })
    }

    // Create an index on the category column
    const { error: indexError } = await supabase.rpc("exec_sql", {
      sql_query: "CREATE INDEX IF NOT EXISTS idx_workshops_category ON workshops(category)",
    })

    if (indexError) {
      console.error("Error creating index on category column:", indexError)
      // We still return success since the column was added
      return NextResponse.json({
        message: "Category column added, but failed to create index",
      })
    }

    return NextResponse.json({ message: "Category column added successfully" })
  } catch (error) {
    console.error("Error in add-category-column API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

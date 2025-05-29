import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const { tableName, columnName } = await request.json()

    if (!tableName || !columnName) {
      return NextResponse.json({ error: "Table name and column name are required" }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    // Check if the column exists using a direct query
    const { data, error } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", tableName)
      .eq("column_name", columnName)
      .maybeSingle()

    if (error) {
      console.error("Error checking if column exists:", error)
      return NextResponse.json({ exists: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ exists: !!data })
  } catch (error) {
    console.error("Error in column-exists API:", error)
    return NextResponse.json({ exists: false, error: "Internal server error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function POST() {
  try {
    const supabase = getSupabaseClient()

    // Create the quotes table
    const { error } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS quotes (
          id SERIAL PRIMARY KEY,
          text TEXT NOT NULL,
          author VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `,
    })

    if (error) {
      console.error("Error creating quotes table:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error creating quotes table:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

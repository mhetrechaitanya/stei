import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    // Try to get the structure of the quotes table
    const { error } = await supabase.rpc("get_table_structure", { table_name: "quotes" })

    if (error) {
      console.log("Quotes table does not exist:", error.message)
      return NextResponse.json({ exists: false, error: error.message })
    }

    return NextResponse.json({ exists: true })
  } catch (error: any) {
    console.error("Error checking quotes table:", error)
    return NextResponse.json({ exists: false, error: error.message }, { status: 500 })
  }
}

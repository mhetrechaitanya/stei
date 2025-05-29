import { getSupabaseServer } from "@/lib/supabase"

export async function getStudents() {
  try {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching students:", error)
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in getStudents:", error)
    return { data: [], error: error.message }
  }
}

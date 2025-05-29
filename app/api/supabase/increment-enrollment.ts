import { getSupabaseServer } from "@/lib/supabase"

export async function incrementBatchEnrollment(batchId: number) {
  try {
    const supabase = getSupabaseServer()

    // Update the batch enrollment count
    const { error } = await supabase
      .from("workshop_batches")
      .update({ enrolled: supabase.rpc("increment_by_one", { row_id: batchId }) })
      .eq("id", batchId)

    if (error) {
      console.error("Error incrementing batch enrollment:", error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to increment batch enrollment:", error)
    return { success: false, error }
  }
}

// Helper function to be used in the booking API route
export async function updateBatchEnrollment(batchId: number) {
  try {
    const supabase = getSupabaseServer()

    // Directly update the enrollment count by adding 1
    const { error } = await supabase
      .from("workshop_batches")
      .update({ enrolled: supabase.raw("enrolled + 1") })
      .eq("id", batchId)

    if (error) {
      console.error("Error updating batch enrollment:", error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to update batch enrollment:", error)
    return { success: false, error }
  }
}

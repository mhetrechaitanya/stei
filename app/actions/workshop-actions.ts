"use server"

import { revalidatePath } from "next/cache"
import { getAdminClient } from "@/utils/student-db-setup"

export async function getWorkshops() {
  try {
    const supabase = getAdminClient()

    const { data, error } = await supabase.from("workshops").select("*").orderBy("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching workshops:", error)
      return { data: [], error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Exception in getWorkshops:", error)
    return { data: [], error: error.message || "Failed to fetch workshops" }
  }
}

export async function getWorkshopBatches(workshopId) {
  try {
    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from("workshop_batches")
      .select("*")
      .eq("workshop_id", workshopId)
      .orderBy("date", { ascending: true })

    if (error) {
      console.error(`Error fetching batches for workshop ${workshopId}:`, error)
      return { data: [], error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error(`Exception in getWorkshopBatches for workshop ${workshopId}:`, error)
    return { data: [], error: error.message || "Failed to fetch workshop batches" }
  }
}

export async function createWorkshop(workshopData) {
  try {
    const supabase = getAdminClient()

    const { data, error } = await supabase.from("workshops").insert([workshopData]).select()

    if (error) {
      console.error("Error creating workshop:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/workshops")
    return { success: true, data }
  } catch (error) {
    console.error("Exception in createWorkshop:", error)
    return { success: false, error: error.message || "Failed to create workshop" }
  }
}

export async function updateWorkshop(workshopId, workshopData) {
  try {
    const supabase = getAdminClient()

    const { data, error } = await supabase.from("workshops").update(workshopData).eq("id", workshopId).select()

    if (error) {
      console.error(`Error updating workshop ${workshopId}:`, error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/workshops")
    return { success: true, data }
  } catch (error) {
    console.error(`Exception in updateWorkshop for workshop ${workshopId}:`, error)
    return { success: false, error: error.message || "Failed to update workshop" }
  }
}

export async function deleteWorkshop(workshopId) {
  try {
    const supabase = getAdminClient()

    const { error } = await supabase.from("workshops").delete().eq("id", workshopId)

    if (error) {
      console.error(`Error deleting workshop ${workshopId}:`, error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/workshops")
    return { success: true }
  } catch (error) {
    console.error(`Exception in deleteWorkshop for workshop ${workshopId}:`, error)
    return { success: false, error: error.message || "Failed to delete workshop" }
  }
}

export async function createBatch(batchData) {
  try {
    const supabase = getAdminClient()

    const { data, error } = await supabase.from("workshop_batches").insert([batchData]).select()

    if (error) {
      console.error("Error creating batch:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/workshops")
    return { success: true, data }
  } catch (error) {
    console.error("Exception in createBatch:", error)
    return { success: false, error: error.message || "Failed to create batch" }
  }
}

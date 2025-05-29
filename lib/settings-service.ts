"use server"

import { getSupabaseServer } from "./supabase-server"
import { TABLES } from "./supabase-config"

export async function getSettings() {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from(TABLES.SETTINGS).select("*")

    if (error) throw error

    // Convert array to object with key-value pairs
    const settings = {}
    data.forEach((item) => {
      settings[item.key] = item.value
    })

    return { data: settings, error: null }
  } catch (error) {
    console.error("Error fetching settings:", error)
    return { data: null, error: error.message }
  }
}

export async function updateSetting(key, value) {
  try {
    const supabase = await getSupabaseServer()

    // Check if setting exists
    const { data: existingData, error: checkError } = await supabase
      .from(TABLES.SETTINGS)
      .select("*")
      .eq("key", key)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found"
      throw checkError
    }

    let result

    if (existingData) {
      // Update existing setting
      result = await supabase.from(TABLES.SETTINGS).update({ value }).eq("key", key).select()
    } else {
      // Create new setting
      result = await supabase.from(TABLES.SETTINGS).insert({ key, value }).select()
    }

    if (result.error) throw result.error
    return { data: result.data, error: null }
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error)
    return { data: null, error: error.message }
  }
}

export async function deleteSetting(key) {
  try {
    const supabase = await getSupabaseServer()
    const { error } = await supabase.from(TABLES.SETTINGS).delete().eq("key", key)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error(`Error deleting setting ${key}:`, error)
    return { error: error.message }
  }
}

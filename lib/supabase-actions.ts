"use server"

import { getSupabaseServer } from "./supabase-server"

// Function to fetch categories for the functions page
export async function fetchFunctionCategories() {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from("function_categories").select("*").order("name")

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    console.error("Error fetching categories:", err)
    return { data: null, error: err.message }
  }
}

// Function to add a new function
export async function addFunction(functionData) {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from("functions").insert(functionData).select()

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    console.error("Error adding function:", err)
    return { data: null, error: err.message }
  }
}

// Function to check tables
export async function checkFunctionTables() {
  try {
    const supabase = await getSupabaseServer()
    const results = {}

    // Check each function-related table
    const tablesToCheck = ["function_categories", "functions", "function_sessions", "function_registrations"]

    for (const table of tablesToCheck) {
      const { data, error, count } = await supabase.from(table).select("*", { count: "exact" }).limit(5)

      results[table] = {
        exists: !error,
        count: count || 0,
        sample: data || [],
        error: error?.message,
      }
    }

    return { data: results, error: null }
  } catch (err) {
    console.error("Error checking tables:", err)
    return { data: null, error: err.message }
  }
}

// Function to fetch tables
export async function fetchTables() {
  try {
    const supabase = await getSupabaseServer()

    // Get list of tables
    const { data, error } = await supabase
      .from("pg_tables")
      .select("tablename")
      .eq("schemaname", "public")
      .order("tablename")
      .catch(() => {
        // If pg_tables view is not accessible, try a different approach
        return { data: null, error: new Error("Cannot access pg_tables view") }
      })

    if (error) {
      console.error("Error fetching tables:", error)
      // Try to get tables by querying known tables
      const knownTables = [
        "function_categories",
        "functions",
        "function_sessions",
        "function_registrations",
        "workshops",
        "workshop_batches",
      ]

      const tableData = []

      for (const table of knownTables) {
        const { error } = await supabase.from(table).select("count(*)", { count: "exact" }).limit(1)
        if (!error) {
          tableData.push({ tablename: table })
        }
      }

      return { data: tableData || [], error: null }
    } else {
      return { data: data || [], error: null }
    }
  } catch (err) {
    console.error("Error in fetchTables:", err)
    return { data: [], error: err.message }
  }
}

// Function to verify Supabase connection
export async function verifySupabaseConnection() {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from("workshops").select("count(*)")

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

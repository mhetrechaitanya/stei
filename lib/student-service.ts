"use server"

import { getSupabaseServer } from "./supabase-server"

export async function getStudents() {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error fetching students:", error)
    return { data: null, error: error.message }
  }
}

export async function getStudentById(id) {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from("students").select("*").eq("id", id).single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error(`Error fetching student ${id}:`, error)
    return { data: null, error: error.message }
  }
}

export async function createStudent(studentData) {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from("students").insert(studentData).select()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error creating student:", error)
    return { data: null, error: error.message }
  }
}

export async function updateStudent(id, studentData) {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from("students").update(studentData).eq("id", id).select()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error(`Error updating student ${id}:`, error)
    return { data: null, error: error.message }
  }
}

export async function deleteStudent(id) {
  try {
    const supabase = await getSupabaseServer()
    const { error } = await supabase.from("students").delete().eq("id", id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error)
    return { error: error.message }
  }
}

export async function getStudentsByWorkshop(workshopId) {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("workshop_id", workshopId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error(`Error fetching students for workshop ${workshopId}:`, error)
    return { data: null, error: error.message }
  }
}

export async function getStudentsByBatch(batchId) {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("batch_id", batchId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error(`Error fetching students for batch ${batchId}:`, error)
    return { data: null, error: error.message }
  }
}

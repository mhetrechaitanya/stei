"use server"

import { getSupabaseServer } from "./supabase-server"
import { TABLES } from "./supabase-config"

export async function getTestimonials() {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from(TABLES.TESTIMONIALS)
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return { data: null, error: error.message }
  }
}

export async function getTestimonialById(id) {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from(TABLES.TESTIMONIALS).select("*").eq("id", id).single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error(`Error fetching testimonial ${id}:`, error)
    return { data: null, error: error.message }
  }
}

export async function createTestimonial(testimonialData) {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from(TABLES.TESTIMONIALS).insert(testimonialData).select()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error creating testimonial:", error)
    return { data: null, error: error.message }
  }
}

export async function updateTestimonial(id, testimonialData) {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from(TABLES.TESTIMONIALS).update(testimonialData).eq("id", id).select()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error(`Error updating testimonial ${id}:`, error)
    return { data: null, error: error.message }
  }
}

export async function deleteTestimonial(id) {
  try {
    const supabase = await getSupabaseServer()
    const { error } = await supabase.from(TABLES.TESTIMONIALS).delete().eq("id", id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error(`Error deleting testimonial ${id}:`, error)
    return { error: error.message }
  }
}

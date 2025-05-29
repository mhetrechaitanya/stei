"use server"

import { getSupabaseServer } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAllQuotes() {
  try {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase
      .from("inspiration_quotes")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching quotes:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getAllQuotes:", error)
    return { success: false, error: "Failed to fetch quotes" }
  }
}

export async function createQuote(formData: FormData) {
  try {
    const supabase = await getSupabaseServer()

    const quote = formData.get("quote") as string
    const author = formData.get("author") as string
    const category = formData.get("category") as string

    if (!quote || !author) {
      return { success: false, error: "Quote and author are required" }
    }

    const { data, error } = await supabase
      .from("inspiration_quotes")
      .insert([{ quote, author, category: category || "General" }])
      .select()

    if (error) {
      console.error("Error creating quote:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/inspiration")
    revalidatePath("/admin/quotes")

    return { success: true, data }
  } catch (error) {
    console.error("Error in createQuote:", error)
    return { success: false, error: "Failed to create quote" }
  }
}

export async function updateQuote(id: string, formData: FormData) {
  try {
    const supabase = await getSupabaseServer()

    const quote = formData.get("quote") as string
    const author = formData.get("author") as string
    const category = formData.get("category") as string

    if (!quote || !author) {
      return { success: false, error: "Quote and author are required" }
    }

    const { data, error } = await supabase
      .from("inspiration_quotes")
      .update({ quote, author, category: category || "General" })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating quote:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/inspiration")
    revalidatePath("/admin/quotes")

    return { success: true, data }
  } catch (error) {
    console.error("Error in updateQuote:", error)
    return { success: false, error: "Failed to update quote" }
  }
}

export async function deleteQuote(id: string) {
  try {
    const supabase = await getSupabaseServer()

    const { error } = await supabase.from("inspiration_quotes").delete().eq("id", id)

    if (error) {
      console.error("Error deleting quote:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/inspiration")
    revalidatePath("/admin/quotes")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteQuote:", error)
    return { success: false, error: "Failed to delete quote" }
  }
}

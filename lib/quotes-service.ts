import { createClient } from "@/utils/supabase/server"

// Define the table name directly to avoid any import issues
const QUOTES_TABLE = "Inspiration_quotes"

export type Quote = {
  id: number
  quote: string
  author: string
  category?: string
  color?: string
  is_featured?: boolean
  created_at?: string
}

export class QuotesService {
  static async getAllQuotes(): Promise<Quote[]> {
    try {
      const supabase = createClient()

      const { data, error } = await supabase.from(QUOTES_TABLE).select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching quotes:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getAllQuotes:", error)
      return []
    }
  }

  static async getRandomQuotes(count = 6): Promise<Quote[]> {
    try {
      const supabase = createClient()

      // Get any quotes, ordered by created_at
      const { data, error } = await supabase
        .from(QUOTES_TABLE)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(count)

      if (error) {
        console.error("Error fetching quotes:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getRandomQuotes:", error)
      return []
    }
  }

  static async createQuote(quoteData: Omit<Quote, "id" | "created_at">): Promise<Quote | null> {
    try {
      const supabase = createClient()

      const { data, error } = await supabase.from(QUOTES_TABLE).insert([quoteData]).select().single()

      if (error) {
        console.error("Error creating quote:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in createQuote:", error)
      return null
    }
  }

  static async getQuoteById(id: number): Promise<Quote | null> {
    try {
      const supabase = createClient()

      const { data, error } = await supabase.from(QUOTES_TABLE).select("*").eq("id", id).single()

      if (error) {
        console.error(`Error fetching quote with id ${id}:`, error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getQuoteById:", error)
      return null
    }
  }
}

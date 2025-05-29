import { createClient } from "@/utils/supabase/server"

// Possible table names to try
const TABLE_NAMES = ["inspiration_quotes", "Inspiration_quotes", "INSPIRATION_QUOTES"]

export async function ensureQuotesTable() {
  try {
    const supabase = createClient()

    // Try to find the table with any of the possible names
    let existingTable = null
    let tableName = null

    for (const name of TABLE_NAMES) {
      const { data, error } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .eq("table_name", name)
        .single()

      if (!error && data) {
        existingTable = data
        tableName = name
        console.log(`Found existing quotes table: ${name}`)
        break
      }
    }

    // If no table exists, create it with lowercase name
    if (!existingTable) {
      console.log("No quotes table found, creating one...")
      tableName = "inspiration_quotes"

      // Create the table
      const { error: createError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE public.${tableName} (
            id SERIAL PRIMARY KEY,
            quote TEXT NOT NULL,
            author VARCHAR(255) NOT NULL,
            category VARCHAR(100),
            color VARCHAR(50),
            is_featured BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `,
      })

      if (createError) {
        console.error("Error creating quotes table:", createError)
        return null
      }

      // Add some initial quotes
      const { error: seedError } = await supabase.from(tableName).insert([
        {
          quote: "The only way to do great work is to love what you do.",
          author: "Steve Jobs",
          category: "Motivation",
          color: "#f8f9fa",
        },
        {
          quote: "Believe you can and you're halfway there.",
          author: "Theodore Roosevelt",
          category: "Inspiration",
          color: "#f8f9fa",
        },
        {
          quote: "It does not matter how slowly you go as long as you do not stop.",
          author: "Confucius",
          category: "Perseverance",
          color: "#f8f9fa",
        },
      ])

      if (seedError) {
        console.error("Error seeding quotes table:", seedError)
      }
    }

    return tableName
  } catch (error) {
    console.error("Error in ensureQuotesTable:", error)
    return null
  }
}

// Get fallback quotes for when the database is unavailable
export function getFallbackQuotes(count = 6) {
  const allQuotes = [
    {
      id: 1,
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "Motivation",
      color: "#f8f9fa",
    },
    {
      id: 2,
      quote: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
      category: "Inspiration",
      color: "#f8f9fa",
    },
    {
      id: 3,
      quote: "It does not matter how slowly you go as long as you do not stop.",
      author: "Confucius",
      category: "Perseverance",
      color: "#f8f9fa",
    },
    {
      id: 4,
      quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      author: "Winston Churchill",
      category: "Success",
      color: "#f8f9fa",
    },
    {
      id: 5,
      quote: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      category: "Dreams",
      color: "#f8f9fa",
    },
    {
      id: 6,
      quote: "The best way to predict the future is to create it.",
      author: "Peter Drucker",
      category: "Future",
      color: "#f8f9fa",
    },
  ]

  return allQuotes.slice(0, count)
}

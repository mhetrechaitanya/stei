"use server"

import { createClient } from "@supabase/supabase-js"

// Export createClient as a named export
export { createClient }

// Create a single supabase client for the entire server
export async function getSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Use fallback values instead of throwing errors
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase credentials. Using fallback values.")
    return createClient(
      "https://inxbcsjlyjruakidaldr.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluemJjc2pseWpydWFraWRhbGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMTg2NDMsImV4cCI6MjA1NzU5NDY0M30.peNZ6VRNBGiZF6B_xeRWSg6pU6qI5hR2nwMK2qjGZM4",
    )
  }

  return createClient(supabaseUrl, supabaseKey)
}

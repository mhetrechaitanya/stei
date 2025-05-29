"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Server-side Supabase client - only used in server components and server actions
let serverClient = null

export async function getSupabaseSecure() {
  if (serverClient) return serverClient

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  // Only use server-side keys, never expose in client
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase configuration, using fallbacks")
    // Use fallbacks if needed, but log a warning
  }

  serverClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })

  return serverClient
}

// Create an auth-aware Supabase client that uses the user's session
export async function getSupabaseWithAuth() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  // Get auth token from cookies
  const supabaseAccessToken = cookieStore.get("sb-access-token")?.value
  const supabaseRefreshToken = cookieStore.get("sb-refresh-token")?.value

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  // If we have tokens, set them to maintain the user's session
  if (supabaseAccessToken && supabaseRefreshToken) {
    await supabase.auth.setSession({
      access_token: supabaseAccessToken,
      refresh_token: supabaseRefreshToken,
    })
  }

  return supabase
}

// Server actions for secure data access
export async function secureDataFetch(table, query = {}) {
  try {
    const supabase = await getSupabaseSecure()
    const { data, error } = await supabase.from(table).select(query.select || "*")

    if (error) {
      console.error(`Error fetching from ${table}:`, error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error(`Error in secureDataFetch:`, error)
    return { data: null, error: "Failed to fetch data securely" }
  }
}

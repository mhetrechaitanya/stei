import { createClient } from "@supabase/supabase-js"
import { cache } from "react"

// Create a singleton instance to prevent multiple client instances
let supabaseClient = null

// Create a mock client function for better error handling
function createMockClient() {
  console.warn("Using mock Supabase client due to missing credentials")

  return {
    from: (table) => ({
      select: () => {
        console.error(`Cannot select from ${table}: Missing Supabase credentials`)
        return Promise.resolve({ data: [], error: { message: "Missing Supabase credentials" } })
      },
      insert: () => {
        console.error(`Cannot insert into ${table}: Missing Supabase credentials`)
        return Promise.resolve({ data: null, error: { message: "Missing Supabase credentials" } })
      },
      update: () => {
        console.error(`Cannot update ${table}: Missing Supabase credentials`)
        return Promise.resolve({ data: null, error: { message: "Missing Supabase credentials" } })
      },
      delete: () => {
        console.error(`Cannot delete from ${table}: Missing Supabase credentials`)
        return Promise.resolve({ error: { message: "Missing Supabase credentials" } })
      },
      eq: () => ({
        select: () => {
          console.error("Cannot perform query: Missing Supabase credentials")
          return Promise.resolve({ data: [], error: { message: "Missing Supabase credentials" } })
        },
      }),
    }),
    auth: {
      signIn: () => {
        console.error("Cannot sign in: Missing Supabase credentials")
        return Promise.resolve({ error: { message: "Missing Supabase credentials" } })
      },
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
    }),
  }
}

// Update the getSupabaseClient function to better handle credentials
export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase credentials. Please check your environment variables.")
    return createMockClient()
  }

  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
    console.log("Supabase client initialized successfully")
    return supabaseClient
  } catch (error) {
    console.error("Error initializing Supabase client:", error)
    return createMockClient()
  }
}

// Cached version for improved performance
export const getCachedSupabaseClient = cache(getSupabaseClient)

// For compatibility with existing code
export const getSupabaseClientSingleton = getSupabaseClient
export const getSupabaseBrowser = getSupabaseClient

"\"use client"

// Create a mock Supabase client that returns empty data
export function getSupabaseBrowser() {
  console.log("Supabase connection is disabled")

  // Return a mock client with methods that return empty data
  return {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
      upsert: () => Promise.resolve({ data: null, error: null }),
      count: () => Promise.resolve({ data: [{ count: 0 }], error: null }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        list: () => Promise.resolve({ data: [], error: null }),
        remove: () => Promise.resolve({ data: null, error: null }),
      }),
    },
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback) => {
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
    },
  }
}

// For compatibility with existing code
export const getSupabaseClient = getSupabaseBrowser

// Auth helper functions
export async function signIn(email, password) {
  console.log("Supabase connection is disabled - Sign in attempt with:", email)
  return { user: null, error: "Supabase connection is disabled" }
}

export async function signOut() {
  console.log("Supabase connection is disabled - Sign out attempt")
  return { error: null }
}

export async function getCurrentUser() {
  console.log("Supabase connection is disabled - Get current user attempt")
  return { user: null, error: null }
}

export { createClient } from "@supabase/supabase-js"

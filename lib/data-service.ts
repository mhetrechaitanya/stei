import { getSupabaseServer } from "@/lib/supabase-server"
import { getWorkshops as fetchWorkshops } from "./workshop-service"

// Cache for workshop data
const workshopsCache = null
const workshopsCacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Security: Sanitize workshop data to prevent XSS
function sanitizeString(str) {
  if (typeof str !== "string") return ""
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .trim()
    .slice(0, 1000) // Limit string length
}

// Security: Validate and sanitize workshop data
function sanitizeWorkshop(workshop) {
  if (!workshop || typeof workshop !== "object") {
    return {
      id: "",
      title: "Untitled Workshop",
      description: "No description available",
      image: "/placeholder.svg?height=400&width=600",
      batches: [],
    }
  }

  return {
    id: workshop.id ? String(workshop.id) : "",
    title: sanitizeString(workshop.title) || "Untitled Workshop",
    slug: sanitizeString(workshop.slug) || "",
    description: sanitizeString(workshop.description) || "No description available",
    image:
      typeof workshop.image === "string" && workshop.image.startsWith("http")
        ? workshop.image
        : "/placeholder.svg?height=400&width=600",
    sessions: typeof workshop.sessions === "number" ? workshop.sessions : 1,
    duration: sanitizeString(workshop.duration) || "2 hours",
    capacity: typeof workshop.capacity === "number" ? workshop.capacity : 10,
    price: typeof workshop.price === "number" ? workshop.price : 0,
    featured: !!workshop.featured,
    status: sanitizeString(workshop.status) || "active",
    benefits: Array.isArray(workshop.benefits)
      ? workshop.benefits.map((b) => sanitizeString(b)).slice(0, 10)
      : ["Learn valuable skills"],
    workshop_code: sanitizeString(workshop.workshop_code) || "",
    batches: [], // Will be populated separately
  }
}

export async function getWorkshops() {
  try {
    const result = await fetchWorkshops()

    // If there's no data but there is an error, log it
    if (!result.data && result.error) {
      console.error("Error in getWorkshops:", result.error)
    }

    // Ensure we always return an array for data, even if empty
    return {
      data: result.data || [],
      error: result.error,
    }
  } catch (error) {
    console.error("Unexpected error in getWorkshops:", error)
    // Return empty array to prevent UI errors
    return { data: [], error }
  }
}

export async function getWorkshopById(id) {
  try {
    // Security: Validate ID
    if (!id || typeof id !== "string" || !/^[a-zA-Z0-9_-]+$/.test(id)) {
      console.error(`Invalid workshop ID: ${id}`)
      return {
        data: null,
        error: "Invalid workshop ID",
      }
    }

    console.log(`Fetching workshop with ID: ${id}`)
    const supabase = await getSupabaseServer()

    if (!supabase) {
      return {
        data: null,
        error: "Database connection error",
      }
    }

    // Fetch the workshop
    const { data, error } = await supabase.from("workshops").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching workshop ${id}:`, error)
      return {
        data: null,
        error: `Failed to fetch workshop: ${error.message}`,
      }
    }

    // Security: Process and sanitize the workshop data
    const processedWorkshop = sanitizeWorkshop(data)

    // Fetch batches for the workshop
    try {
      const { data: batches, error: batchError } = await supabase
        .from("workshop_batches")
        .select("*")
        .eq("workshop_id", id)
        .order("date", { ascending: true })

      if (!batchError && batches && batches.length > 0) {
        processedWorkshop.batches = batches.map((batch) => ({
          id: batch.id,
          date: sanitizeString(batch.date) || "TBD",
          time: sanitizeString(batch.time) || "TBD",
          slots: typeof batch.slots === "number" ? batch.slots : 0,
          enrolled: typeof batch.enrolled === "number" ? batch.enrolled : 0,
        }))
      }
    } catch (batchError) {
      console.error(`Error fetching batches for workshop ${id}:`, batchError)
      // Don't fail the whole request if batches can't be fetched
    }

    console.log(`Successfully fetched workshop: ${processedWorkshop.title}`)
    return { data: processedWorkshop, error: null }
  } catch (error) {
    console.error(`Error in getWorkshopById for ${id}:`, error)
    return {
      data: null,
      error: `Failed to fetch workshop: ${error.message}`,
    }
  }
}

export async function getTestimonials() {
  try {
    console.log("Fetching testimonials...")
    const supabase = await getSupabaseServer()

    if (!supabase) {
      return {
        data: [],
        error: "Database connection error",
      }
    }

    // Check if testimonials table exists
    const { error: tableCheckError } = await supabase.from("testimonials").select("id").limit(1)

    if (tableCheckError && tableCheckError.code === "42P01") {
      console.log("Testimonials table does not exist yet")
      return { data: [], error: null } // Return empty array instead of error
    }

    const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching testimonials:", error)
      return {
        data: [],
        error: `Failed to fetch testimonials: ${error.message}`,
      }
    }

    // Security: Sanitize testimonial data
    const sanitizedData = Array.isArray(data)
      ? data.map((testimonial) => ({
          id: testimonial.id,
          name: sanitizeString(testimonial.name) || "Anonymous",
          text: sanitizeString(testimonial.text) || "Great experience!",
          rating: typeof testimonial.rating === "number" ? Math.min(5, Math.max(1, testimonial.rating)) : 5,
          workshop_id: testimonial.workshop_id ? String(testimonial.workshop_id) : "",
          created_at: testimonial.created_at || new Date().toISOString(),
        }))
      : []

    console.log(`Successfully fetched ${sanitizedData.length || 0} testimonials`)
    return { data: sanitizedData, error: null }
  } catch (error) {
    console.error("Error in getTestimonials:", error)
    return {
      data: [], // Return empty array on error to prevent UI issues
      error: `Failed to fetch testimonials: ${error.message}`,
    }
  }
}

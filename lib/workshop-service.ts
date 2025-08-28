"use server"

import { getSupabaseServer } from "@/utils/supabase/server"
import { TABLES } from "./supabase-config"
import { cache } from "react"
import { revalidatePath } from "next/cache"

// Default workshop categories to use as fallback
const DEFAULT_CATEGORIES = ["iACE Series", "Self-growth", "The Strength of She"]

// Sample workshops to use as fallback
const SAMPLE_WORKSHOPS = [
  {
    id: "sample-1",
    name: "Leadership Development",
    slug: "leadership-development",
    description: "Develop essential leadership skills to inspire and guide your team to success.",
    image: "/diverse-group-leadership.png",
    sessions_r: 6,
    duration_v: "2",
    duration_u: "hours",
    capacity: 15,
    fee: 5999,
    featured: true,
    status: "active",
    benefits: ["Improve team communication", "Learn effective delegation", "Develop strategic thinking"],
    workshop_code: "LED1234",
    category_id: "Self-growth",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sample-2",
    name: "Public Speaking Mastery",
    slug: "public-speaking-mastery",
    description: "Overcome fear and master the art of public speaking with confidence and clarity.",
    image: "/public-speaking-stage.png",
    sessions_r: 4,
    duration_v: "3",
    duration_u: "hours",
    capacity: 12,
    fee: 4999,
    featured: true,
    status: "active",
    benefits: ["Overcome stage fright", "Structure compelling presentations", "Engage any audience"],
    workshop_code: "PSM5678",
    category_id: "iACE Series",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sample-3",
    name: "Women's Leadership Summit",
    slug: "womens-leadership-summit",
    description: "Empower yourself with leadership skills specifically designed for women in the workplace.",
    image: "/placeholder.svg?key=junp9",
    sessions_r: 3,
    duration_v: "4",
    duration_u: "hours",
    capacity: 15,
    fee: 6999,
    featured: true,
    status: "active",
    benefits: ["Navigate workplace challenges", "Build confidence", "Create support networks"],
    workshop_code: "WLS3456",
    category_id: "The Strength of She",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "free-1",
    name: "Introduction to Leadership",
    slug: "introduction-to-leadership",
    description: "Discover the fundamentals of effective leadership in this free introductory session. Learn key principles that will set you on the path to becoming an inspiring leader.",
    image: "/diverse-group-leadership.png",
    sessions_r: 1,
    duration_v: "2",
    duration_u: "hours",
    capacity: 50,
    fee: 0,
    featured: true,
    status: "active",
    benefits: ["Understand leadership basics", "Identify your leadership style", "Learn communication techniques"],
    workshop_code: "FREE-LED-001",
    category_id: "Self-growth",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "free-2",
    name: "Public Speaking Basics",
    slug: "public-speaking-basics",
    description: "Learn essential public speaking techniques in this complimentary workshop. Overcome stage fright and build confidence in your communication skills.",
    image: "/public-speaking-stage.png",
    sessions_r: 1,
    duration_v: "1.5",
    duration_u: "hours",
    capacity: 40,
    fee: 0,
    featured: true,
    status: "active",
    benefits: ["Overcome stage fright", "Learn speech structure", "Practice vocal techniques"],
    workshop_code: "FREE-PSB-002",
    category_id: "iACE Series",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "free-3",
    name: "Mindset Transformation",
    slug: "mindset-transformation",
    description: "Transform your limiting beliefs and develop a growth mindset that will propel you towards success in all areas of life.",
    image: "/placeholder.svg?key=junp9",
    sessions_r: 1,
    duration_v: "2.5",
    duration_u: "hours",
    capacity: 60,
    fee: 0,
    featured: true,
    status: "active",
    benefits: ["Identify limiting beliefs", "Develop growth mindset", "Create positive habits"],
    workshop_code: "FREE-MT-003",
    category_id: "Self-growth",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

// Cache the workshop data for 60 seconds
export const getWorkshops = cache(async () => {
  try {
    console.log("Fetching workshops from database...")
    const supabase = await getSupabaseServer()

    // Check if supabase client is properly initialized
    if (!supabase || typeof supabase.from !== "function") {
      console.error("Supabase client not properly initialized")
      return {
        data: SAMPLE_WORKSHOPS,
        error: "Database connection error",
        fallback: true,
      }
    }

    // Try to fetch workshops from the database
    const { data, error } = await supabase.from("workshops").select(`
        *,
        batches (*)
      `)

    if (error) {
      console.error("Supabase error fetching workshops:", error)

      // If the table doesn't exist, try to initialize it
      if (error.code === "42P01") {
        console.log("Workshops table doesn't exist, trying to initialize...")
        try {
          // Try to initialize via API
          const initResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/workshops`, {
            method: "GET",
            headers: {
              "Cache-Control": "no-cache",
              "x-initialize": "true",
            },
          })

          if (initResponse.ok) {
            const initData = await initResponse.json()
            console.log("Successfully initialized workshops table:", initData.length)
            return {
              data: initData,
              error: null,
              fallback: false,
            }
          }
        } catch (initError) {
          console.error("Failed to initialize workshops table:", initError)
        }
      }

      return {
        data: SAMPLE_WORKSHOPS,
        error,
        fallback: true,
      }
    }

    // Check if data is null or undefined and provide a fallback
    if (!data || !Array.isArray(data)) {
      console.warn("No workshop data returned from database")
      return {
        data: SAMPLE_WORKSHOPS,
        error: null,
        fallback: true,
      }
    }

    // If no workshops found, try to initialize the table
    if (data.length === 0) {
      console.log("No workshops found, trying to initialize...")
      try {
        // Try to initialize via API
        const initResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/workshops`, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
            "x-initialize": "true",
          },
        })

        if (initResponse.ok) {
          const initData = await initResponse.json()
          console.log("Successfully initialized workshops table:", initData.length)
          if (initData.length > 0) {
            return {
              data: initData,
              error: null,
              fallback: false,
            }
          }
        }
      } catch (initError) {
        console.error("Failed to initialize workshops table:", initError)
      }
    }

    // Process the data to ensure upcoming batches are properly formatted
    const processedData = data.map((workshop) => {
      // Ensure batches is always an array
      const batches = Array.isArray(workshop.batches) ? workshop.batches : []

      // Add upcoming property that's expected by the UI
      return {
        ...workshop,
        upcoming: batches,
      }
    })

    // Sort manually instead of using order
    processedData.sort((a, b) => {
      const dateA = new Date(a.created_at || 0)
      const dateB = new Date(b.created_at || 0)
      return dateB.getTime() - dateA.getTime() // Descending order
    })

    console.log(`Successfully fetched ${processedData.length} workshops`)
    return { data: processedData, error: null, fallback: false }
  } catch (error) {
    console.error("Error fetching workshops:", error)
    return {
      data: SAMPLE_WORKSHOPS,
      error,
      fallback: true,
    }
  }
})

// Cache the workshop by ID for 60 seconds
export const getWorkshopById = cache(async (id: string) => {
  try {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase
      .from("workshops")
      .select(`
        *,
        batches (*),
        mentor:mentor_id (
          id,
          name,
          title,
          bio,
          image,
          email,
          phone,
          linkedin_url
        ),
        testimonials (*)
      `)
      .eq("id", id)
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching workshop:", error)
    return { data: null, error }
  }
})

// Simplified to avoid using methods that might not be available in the mock client
export const getWorkshopCategories = cache(async () => {
  try {
    // Return the specified categories
    // In a real implementation, these would be fetched from the database
    return {
      data: DEFAULT_CATEGORIES,
      error: null,
    }
  } catch (error) {
    console.error("Error fetching workshop categories:", error)
    return { data: DEFAULT_CATEGORIES, error }
  }
})

// Get categories that have workshops
export const getActiveWorkshopCategories = cache(async () => {
  try {
    const { data: workshops, error, fallback } = await getWorkshops()

    if (error || fallback) {
      console.warn("Using fallback categories due to error:", error)
      return getWorkshopCategories()
    }

    // Extract unique categories from workshops
    const categoriesWithWorkshops = [
      ...new Set(
        workshops
          .map((workshop) => workshop.category_id)
          .filter(Boolean), // Remove null/undefined
      ),
    ]

    // If no categories found, return the default ones
    if (categoriesWithWorkshops.length === 0) {
      return getWorkshopCategories()
    }

    return { data: categoriesWithWorkshops, error: null }
  } catch (error) {
    console.error("Error fetching active workshop categories:", error)
    // Fallback to default categories
    return getWorkshopCategories()
  }
})

// Simplified to avoid using methods that might not be available in the mock client
export const getWorkshopsByCategory = cache(async (category: string) => {
  try {
    // If category is "all" or not provided, just return all workshops
    if (!category || category === "all") {
      return getWorkshops()
    }

    // Otherwise, get all workshops and filter manually
    const { data: allWorkshops, error } = await getWorkshops()

    if (error) throw error

    // Filter workshops by category
    const filteredWorkshops = allWorkshops.filter((workshop) => workshop.category_id === category)

    return { data: filteredWorkshops, error: null }
  } catch (error) {
    console.error("Error fetching workshops by category:", error)
    return { data: [], error }
  }
})

export async function createWorkshop(workshopData) {
  try {
    console.log("Creating workshop with data:", workshopData)

    // Generate a workshop code if not provided
    if (!workshopData.workshop_code) {
      const prefix = workshopData.name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("")
        .substring(0, 3)

      const randomPart = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")
      workshopData.workshop_code = `${prefix}${randomPart}`
    }

    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from(TABLES.WORKSHOPS)
      .insert({
        name: workshopData.name,
        slug: workshopData.slug,
        description: workshopData.description,
        image: workshopData.image || "",
        sessions_r: Number(workshopData.sessions_r) || 4,
        duration_v: workshopData.duration_v || "2",
        duration_u: workshopData.duration_u || "hours",
        capacity: Number(workshopData.capacity) || 15,
        fee: Number(workshopData.fee) || 4999,
        featured: Boolean(workshopData.featured),
        status: workshopData.status || "active",
        benefits: workshopData.benefits || ["Learn valuable skills"],
        workshop_code: workshopData.workshop_code,
        zoom_link: workshopData.zoomLink || null,
        category_id: workshopData.category_id || null,
        instructor: workshopData.instructor || null,
        minutes_p: workshopData.minutes_p || 0,
        start_date: workshopData.start_date || null,
        session_start_time: workshopData.session_start_time || null,
      })
      .select()

    if (error) throw error

    // Create a batch if startDate is provided
    if (workshopData.start_date && data && data.length > 0) {
      const workshopId = data[0].id
      const batchData = {
        workshop_id: workshopId,
        date: workshopData.start_date,
        time:
          workshopData.session_start_time && workshopData.session_end_time
            ? `${workshopData.session_start_time} - ${workshopData.session_end_time}`
            : workshopData.session_start_time
              ? `${workshopData.session_start_time} - TBD`
              : "10:00 - 12:00",
        slots: Number(workshopData.capacity) || 15,
        enrolled: 0,
      }

      await supabase.from(TABLES.WORKSHOP_BATCHES).insert(batchData)
    }

    // Revalidate the workshops page to show the new workshop
    revalidatePath("/workshops")

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Error creating workshop:", error)
    return { success: false, data: null, error: error.message }
  }
}

export async function updateWorkshop(id, workshopData) {
  try {
    const supabase = await getSupabaseServer()

    // Prepare the update data
    const updateData = {
      name: workshopData.name,
      slug: workshopData.slug,
      description: workshopData.description,
      image: workshopData.image || "",
      sessions_r: Number(workshopData.sessions_r) || 4,
      duration_v: workshopData.duration_v || "2",
      duration_u: workshopData.duration_u || "hours",
      capacity: Number(workshopData.capacity) || 15,
      fee: Number(workshopData.fee) || 4999,
      featured: Boolean(workshopData.featured),
      status: workshopData.status || "active",
      benefits: workshopData.benefits || ["Learn valuable skills"],
      zoom_link: workshopData.zoomLink || null,
      category_id: workshopData.category_id || null,
      instructor: workshopData.instructor || null,
      minutes_p: workshopData.minutes_p || 0,
      start_date: workshopData.start_date || null,
      session_start_time: workshopData.session_start_time || null,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from(TABLES.WORKSHOPS).update(updateData).eq("id", id).select()

    if (error) throw error

    // Update or create a batch if startDate is provided
    if (workshopData.start_date) {
      // Check if a batch already exists
      const { data: existingBatches } = await supabase
        .from(TABLES.WORKSHOP_BATCHES)
        .select("id")
        .eq("workshop_id", id)
        .limit(1)

      const batchData = {
        workshop_id: id,
        date: workshopData.start_date,
        time:
          workshopData.session_start_time && workshopData.session_end_time
            ? `${workshopData.session_start_time} - ${workshopData.session_end_time}`
            : workshopData.session_start_time
              ? `${workshopData.session_start_time} - TBD`
              : "10:00 - 12:00",
        slots: Number(workshopData.capacity) || 15,
      }

      if (existingBatches && existingBatches.length > 0) {
        // Update existing batch
        await supabase.from(TABLES.WORKSHOP_BATCHES).update(batchData).eq("id", existingBatches[0].id)
      } else {
        // Create new batch
        batchData["enrolled"] = 0
        await supabase.from(TABLES.WORKSHOP_BATCHES).insert(batchData)
      }
    }

    // Revalidate the workshops page and the specific workshop page
    revalidatePath("/workshops")
    revalidatePath(`/workshops/${id}`)

    return { success: true, data, error: null }
  } catch (error) {
    console.error(`Error updating workshop ${id}:`, error)
    return { success: false, data: null, error: error.message }
  }
}

export async function deleteWorkshop(id) {
  try {
    const supabase = await getSupabaseServer()

    // First delete related batches
    const { error: batchError } = await supabase.from(TABLES.WORKSHOP_BATCHES).delete().eq("workshop_id", id)

    if (batchError) throw batchError

    // Then delete the workshop
    const { error } = await supabase.from(TABLES.WORKSHOPS).delete().eq("id", id)

    if (error) throw error

    // Revalidate all relevant paths
    revalidatePath("/workshops")
    revalidatePath("/") // Revalidate homepage if it shows workshops
    revalidatePath("/workshops/[id]", "page") // Revalidate all workshop detail pages
    revalidatePath("/api/workshops") // Revalidate the API endpoint

    return { success: true, error: null }
  } catch (error) {
    console.error(`Error deleting workshop ${id}:`, error)
    return { success: false, error: error.message }
  }
}

export async function createBatch(batchData) {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from(TABLES.WORKSHOP_BATCHES).insert(batchData).select()

    if (error) throw error

    // Revalidate the workshops page and the specific workshop page
    revalidatePath("/workshops")
    if (batchData.workshop_id) {
      revalidatePath(`/workshops/${batchData.workshop_id}`)
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Error creating batch:", error)
    return { success: false, data: null, error: error.message }
  }
}

export async function updateBatch(id, batchData) {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from(TABLES.WORKSHOP_BATCHES).update(batchData).eq("id", id).select()

    if (error) throw error

    // Revalidate the workshops page and the specific workshop page
    revalidatePath("/workshops")
    if (batchData.workshop_id) {
      revalidatePath(`/workshops/${batchData.workshop_id}`)
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error(`Error updating batch ${id}:`, error)
    return { success: false, data: null, error: error.message }
  }
}

export async function deleteBatch(id) {
  try {
    const supabase = await getSupabaseServer()

    // Get the workshop_id before deleting
    const { data: batchData } = await supabase.from(TABLES.WORKSHOP_BATCHES).select("workshop_id").eq("id", id).single()
    const workshopId = batchData?.workshop_id

    const { error } = await supabase.from(TABLES.WORKSHOP_BATCHES).delete().eq("id", id)

    if (error) throw error

    // Revalidate the workshops page and the specific workshop page
    revalidatePath("/workshops")
    if (workshopId) {
      revalidatePath(`/workshops/${workshopId}`)
    }

    return { success: true, error: null }
  } catch (error) {
    console.error(`Error deleting batch:`, error);
    return { success: false, error: (error as Error).message };
  }
}
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

export async function GET(request: Request, { params }) {
  const { id } = params

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Missing database credentials",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch the workshop by ID
    const { data, error } = await supabase
      .from("workshops")
      .select(`
        *,
        batches (*),
        mentor:mentor_id (*),
        testimonials (*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to fetch workshop",
          details: error.message,
        },
        { status: 500 },
      )
    }

    if (!data) {
      return NextResponse.json(
        {
          error: "Workshop not found",
          details: `No workshop found with ID: ${id}`,
        },
        { status: 404 },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error fetching workshop ${id}:`, error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }) {
  const { id } = params

  try {
    // Parse request body
    const workshopData = await request.json()

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Missing database credentials",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Prepare the update data
    const updateData = {
      title: workshopData.title,
      description: workshopData.description,
      price: Number(workshopData.price) || 4999,
      sessions: Number(workshopData.sessions) || 4,
      duration: workshopData.duration || "2 hours per session",
      capacity: Number(workshopData.capacity) || 15,
      category: workshopData.category || null,
      image: workshopData.image || null,
      updated_at: new Date().toISOString(),
    }

    // Update the workshop
    const { data, error } = await supabase.from("workshops").update(updateData).eq("id", id).select()

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to update workshop",
          details: error.message,
        },
        { status: 500 },
      )
    }

    // Revalidate the workshops page and the specific workshop page
    revalidatePath("/workshops")
    revalidatePath(`/workshops/${id}`)

    return NextResponse.json({
      success: true,
      data: data[0],
      message: "Workshop updated successfully",
    })
  } catch (error) {
    console.error(`Error updating workshop ${id}:`, error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }) {
  const { id } = params

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Missing database credentials",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // First delete related batches
    await supabase.from("workshop_batches").delete().eq("workshop_id", id)

    // Then delete the workshop
    const { error } = await supabase.from("workshops").delete().eq("id", id)

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to delete workshop",
          details: error.message,
        },
        { status: 500 },
      )
    }

    // Revalidate all relevant paths
    revalidatePath("/workshops")
    revalidatePath("/") // Revalidate homepage if it shows workshops
    revalidatePath("/workshops/[id]", "page") // Revalidate all workshop detail pages
    revalidatePath("/api/workshops") // Revalidate the API endpoint

    return NextResponse.json({
      success: true,
      message: "Workshop deleted successfully",
    })
  } catch (error) {
    console.error(`Error deleting workshop ${id}:`, error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

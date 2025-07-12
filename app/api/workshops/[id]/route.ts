import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    // Fetch the workshop by ID with the correct field names
    const { data, error } = await supabase
      .from("workshops")
      .select(`
        *,
        batches:workshop_batches (*),
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

    // Transform the data to include both old and new field names for compatibility
    const transformedData = {
      ...data,
      // Add compatibility fields for frontend components that expect old names
      title: data.name,
      price: data.fee,
      sessions: data.sessions_r,
      duration: data.duration_v && data.duration_u ? `${data.duration_v} ${data.duration_u}` : "2 hours per session",
    }

    return NextResponse.json(transformedData)
  } catch (error: unknown) {
    console.error(`Error fetching workshop ${id}:`, error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    // Prepare the update data using correct field names
    const updateData = {
      name: workshopData.title || workshopData.name,
      description: workshopData.description,
      fee: Number(workshopData.price || workshopData.fee) || 4999,
      sessions_r: Number(workshopData.sessions || workshopData.sessions_r) || 4,
      duration_v: workshopData.duration_v || "2",
      duration_u: workshopData.duration_u || "hours",
      capacity: Number(workshopData.capacity) || 15,
      category_id: workshopData.category || workshopData.category_id || null,
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
  } catch (error: unknown) {
    console.error(`Error updating workshop ${id}:`, error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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
  } catch (error: unknown) {
    console.error(`Error deleting workshop ${id}:`, error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

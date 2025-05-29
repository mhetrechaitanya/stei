import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getActiveWorkshopCategories } from "@/lib/workshop-service"
import { revalidatePath } from "next/cache"

// GET handler to fetch all workshop categories
export async function GET() {
  try {
    const { data, error } = await getActiveWorkshopCategories()

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to fetch categories",
          details: error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ categories: data })
  } catch (error) {
    console.error("Error in GET workshop categories:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

// POST handler to add a new category
export async function POST(request: Request) {
  try {
    const { category } = await request.json()

    if (!category) {
      return NextResponse.json(
        {
          error: "Missing required field",
          details: "Category name is required",
        },
        { status: 400 },
      )
    }

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

    // Get existing categories
    const { data: existingCategories } = await getActiveWorkshopCategories()

    // Check if category already exists
    if (existingCategories && existingCategories.includes(category)) {
      return NextResponse.json(
        {
          error: "Category already exists",
          details: `The category "${category}" already exists`,
        },
        { status: 409 },
      )
    }

    // Update categories in the database
    // This is a simplified approach - in a real app, you might have a categories table
    // For now, we'll just update a few workshops to have this category
    const { error: updateError } = await supabase.rpc("exec_sql", {
      sql_string: `
        UPDATE workshops
        SET category = '${category}'
        WHERE id IN (
          SELECT id FROM workshops
          WHERE category IS NULL OR category = ''
          LIMIT 3
        );
      `,
    })

    if (updateError) {
      console.error("Error updating workshops with new category:", updateError)
      return NextResponse.json(
        {
          error: "Database error",
          details: updateError.message,
        },
        { status: 500 },
      )
    }

    // Revalidate the workshops page
    revalidatePath("/workshops")

    return NextResponse.json({
      success: true,
      message: "Category added successfully",
    })
  } catch (error) {
    console.error("Error in POST workshop categories:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

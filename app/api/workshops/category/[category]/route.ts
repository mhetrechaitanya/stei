import { type NextRequest, NextResponse } from "next/server"
import { getWorkshopsByCategory } from "@/lib/workshop-service"

export async function GET(request: NextRequest, { params }: { params: { category: string } }) {
  try {
    const category = params.category

    if (!category) {
      return NextResponse.json({ error: "Category parameter is required" }, { status: 400 })
    }

    const { data: workshops, error } = await getWorkshopsByCategory(category)

    if (error) {
      return NextResponse.json({ error: "Failed to fetch workshops" }, { status: 500 })
    }

    return NextResponse.json({ workshops })
  } catch (error) {
    console.error("Error in workshops category API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

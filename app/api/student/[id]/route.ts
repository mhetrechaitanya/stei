import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        message: "Student ID is required",
      },
      { status: 400 },
    )
  }

  try {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase.from("students").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching student:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch student data",
          details: error.message,
        },
        { status: 500 },
      )
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      student: data,
    })
  } catch (error) {
    console.error("Unexpected error fetching student:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

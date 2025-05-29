import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const data = await request.json()

    // Validate required fields
    const requiredFields = ["first_name", "last_name", "email", "phone", "address"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ success: false, error: `${field} is required` }, { status: 400 })
      }
    }

    // Insert student data according to the schema
    const { data: student, error } = await supabase
      .from("students")
      .insert([
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          status: data.status || "active",
          email_consent: data.email_consent || false,
          joined_date: data.joined_date || new Date().toISOString().split("T")[0],
          // created_at and updated_at will be handled by Supabase defaults
        },
      ])
      .select()

    if (error) {
      console.error("Error inserting student:", error)

      // Check for duplicate email error
      if (error.code === "23505" && error.message.includes("email")) {
        return NextResponse.json({ success: false, error: "Email already registered" }, { status: 409 })
      }

      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Student registered successfully",
      data: student,
    })
  } catch (error) {
    console.error("Error in student registration API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

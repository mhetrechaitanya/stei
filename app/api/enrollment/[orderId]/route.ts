import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function PATCH(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const orderId = params.orderId
    const body = await request.json()
    const { transactionId, paymentStatus, paymentDetails } = body

    // Validate required fields
    if (!transactionId || !paymentStatus) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Update enrollment
    const { data: enrollment, error } = await supabase
      .from("enrollments")
      .update({
        transaction_id: transactionId,
        payment_status: paymentStatus,
        payment_details: paymentDetails,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId)
      .select()
      .single()

    if (error) {
      console.error("Error updating enrollment:", error)
      return NextResponse.json({ success: false, message: "Failed to update enrollment" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      enrollment,
      message: "Enrollment updated successfully",
    })
  } catch (error) {
    console.error("Error in update enrollment API:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

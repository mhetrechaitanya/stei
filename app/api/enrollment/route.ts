import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { studentId, workshopId, batchId, orderId, amount, paymentStatus } = body

    if (!studentId || !workshopId || !batchId || !orderId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Check if already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", studentId)
      .eq("workshop_id", workshopId)
      .eq("batch_id", batchId)
      .maybeSingle()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking enrollment:", checkError)
      return NextResponse.json({ success: false, message: "Failed to check enrollment" }, { status: 500 })
    }

    if (existingEnrollment) {
      return NextResponse.json({
        success: false,
        message: "Student is already enrolled in this workshop batch",
      }, { status: 400 })
    }

    // Insert enrollment
    const insertResult = await supabase
      .from("enrollments")
      .insert([{
        student_id: studentId,
        workshop_id: workshopId,
        batch_id: batchId,
        order_id: orderId,
        amount,
        payment_status: paymentStatus || "pending",
        created_at: new Date().toISOString(),
      }])
      .select()

    if (insertResult.error) {
      console.error("Insert error:", insertResult.error)
      return NextResponse.json({ success: false, message: "Failed to create enrollment" }, { status: 500 })
    }

    if (!insertResult.data || insertResult.data.length === 0) {
      console.error("Insert succeeded but returned no data")
      return NextResponse.json({ success: false, message: "Enrollment insert returned no data" }, { status: 500 })
    }

    const enrollment = insertResult.data[0]

    // Increment enrollment count (non-blocking)
    try {
      await supabase.rpc("increment_enrollment", { p_batch_id: batchId })
    } catch (rpcError) {
      console.warn("Failed to increment batch enrollment count:", rpcError)
    }

    // Fetch student info
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("first_name, email")
      .eq("id", studentId)
      .single()

    if (studentError || !student) {
      console.warn("Failed to fetch student data:", studentError)
    }

    // Fetch batch info
    const { data: batch, error: batchError } = await supabase
      .from("batches")
      .select("zoom_link, zoom_id, zoom_password, start_date, start_time")
      .eq("id", batchId)
      .single()

    if (batchError || !batch) {
      console.warn("Failed to fetch batch data:", batchError)
    }

    // Send confirmation email if data is complete
    if (student && batch) {
      try {
        const emailRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-done-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: student.email,
            first_name: student.first_name,
            amount: amount.toString(),
            workshop_dates: batch.start_date || "N/A",
            workshop_time: batch.start_time || "N/A",
            meeting_link: batch.zoom_link || "",
            meeting_id: batch.zoom_id || "",
            meeting_password: batch.zoom_password || "",
          }),
        })

        const emailResult = await emailRes.json()
        if (!emailRes.ok || !emailResult.success) {
          console.warn("Email failed to send:", emailResult.error)
        }
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Enrollment created successfully and email sent",
      enrollment,
    })

  } catch (error: any) {
    console.error("Unhandled error in enrollment:", error)
    return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 })
  }
}

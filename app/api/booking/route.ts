import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    // Check if the request is JSON or FormData
    const contentType = request.headers.get("content-type") || ""
    let data: any

    if (contentType.includes("application/json")) {
      // Handle JSON request (for already registered students)
      data = await request.json()
    } else {
      // Handle FormData request (for new registrations)
      const formData = await request.formData()

      // Convert FormData to object
      data = {}
      for (const [key, value] of formData.entries()) {
        data[key] = value
      }
    }

    // Extract common required fields
    const {
      name,
      email,
      phone,
      address,
      pincode,
      workshopId,
      batchId,
      transactionId,
      orderId,
      paymentStatus,
      paymentDetails,
      amount,
    } = data

    // Validate required fields
    if (!name || !email || !phone || !address || !pincode || !workshopId || !batchId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if this is an existing student booking a new workshop
    const studentId = data.studentId

    if (studentId) {
      // This is an existing student booking a new workshop
      // Insert only the booking information
      const { data: bookingData, error: bookingError } = await supabase
        .from("students")
        .insert({
          name,
          email,
          phone,
          address,
          city: data.city || null,
          state: data.state || null,
          pincode,
          workshop_id: Number.parseInt(workshopId),
          batch_id: Number.parseInt(batchId),
          transaction_id: transactionId || null,
          order_id: orderId || null,
          payment_status: paymentStatus || "pending",
          payment_details: paymentDetails || null,
          amount: amount ? Number.parseFloat(amount) : null,
          // Link to the existing student
          parent_student_id: studentId,
        })
        .select()

      if (bookingError) {
        console.error("Error inserting booking data:", bookingError)
        return NextResponse.json({ success: false, error: bookingError.message }, { status: 500 })
      }

      // If payment is successful, increment the enrollment count for the batch
      if (paymentStatus === "paid") {
        await fetch(`${request.nextUrl.origin}/api/supabase/increment-enrollment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ batchId }),
        })
      }

      return NextResponse.json({ success: true, data: bookingData })
    } else {
      // This is a new registration with booking
      // Insert student data
      const { data: studentData, error } = await supabase
        .from("students")
        .insert({
          name,
          email,
          phone,
          address,
          city: data.city || null,
          state: data.state || null,
          pincode,
          dob: data.dob || null,
          education: data.education || null,
          occupation: data.occupation || null,
          organization: data.organization || null,
          experience: data.experience ? Number.parseInt(data.experience) : null,
          expectations: data.expectations || null,
          referral_source: data.referral || null,
          affiliate: data.affiliate || null,
          workshop_id: Number.parseInt(workshopId),
          batch_id: Number.parseInt(batchId),
          transaction_id: transactionId || null,
          order_id: orderId || null,
          payment_status: paymentStatus || "pending",
          payment_details: paymentDetails || null,
          amount: amount ? Number.parseFloat(amount) : null,
        })
        .select()

      if (error) {
        console.error("Error inserting student data:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }

      // If payment is successful, increment the enrollment count for the batch
      if (paymentStatus === "paid") {
        await fetch(`${request.nextUrl.origin}/api/supabase/increment-enrollment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ batchId }),
        })
      }

      return NextResponse.json({ success: true, data: studentData })
    }
  } catch (error) {
    console.error("Error processing booking:", error)
    return NextResponse.json({ success: false, error: "Failed to process booking" }, { status: 500 })
  }
}

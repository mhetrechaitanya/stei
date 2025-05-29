import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"
import crypto from "crypto"

// Rate limiting map (in a production app, use Redis or similar)
const rateLimitMap = new Map()

export async function GET(request: NextRequest) {
  try {
    // Get the order_id from the query parameters
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get("order_id")

    // SECURITY: Implement basic rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown"
    const rateLimitKey = `${clientIp}:payment-status`

    const now = Date.now()
    const rateLimit = rateLimitMap.get(rateLimitKey) || { count: 0, timestamp: now }

    // Reset count if more than 1 minute has passed
    if (now - rateLimit.timestamp > 60000) {
      rateLimit.count = 0
      rateLimit.timestamp = now
    }

    // Increment count
    rateLimit.count++
    rateLimitMap.set(rateLimitKey, rateLimit)

    // If more than 10 requests in a minute, rate limit
    if (rateLimit.count > 10) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    // SECURITY: Validate order ID
    if (!orderId || !/^[a-zA-Z0-9_-]+$/.test(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

    // Get Supabase client
    const supabase = getSupabaseServer()

    // SECURITY: Generate a request ID for tracking
    const requestId = crypto.randomUUID()

    // Check payment status in database first
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .select("payment_status, transaction_id")
      .eq("order_id", orderId)
      .limit(1)

    if (studentError) {
      console.error("Error fetching student data:", studentError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (!studentData || studentData.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // If payment is already marked as paid, return success
    if (studentData[0].payment_status === "paid") {
      return NextResponse.json({
        status: "success",
        payment_status: "paid",
        transaction_id: studentData[0].transaction_id || null,
      })
    }

    // If not paid, check with Cashfree
    // Only do this if we're using real payments
    if (process.env.NEXT_PUBLIC_USE_REAL_PAYMENT_API === "true") {
      // SECURITY: Validate Cashfree credentials
      if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
        console.error("Missing Cashfree credentials for status check")
        return NextResponse.json({ error: "Configuration error" }, { status: 500 })
      }

      // Check with Cashfree API
      const cashfreeApiUrl =
        process.env.NODE_ENV === "production"
          ? `https://api.cashfree.com/pg/orders/${orderId}`
          : `https://sandbox.cashfree.com/pg/orders/${orderId}`

      const response = await fetch(cashfreeApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": "TEST103792578c8276a419be342cb08175297301",
          "x-client-secret": "cfsk_ma_test_a0fb8a9f3f04ee8beca80a8268c53f0a_67d74e28",
          "x-request-id": requestId,
        },
      })

      if (!response.ok) {
        console.error(`Cashfree API error: ${response.status} ${response.statusText}`)
        return NextResponse.json({
          status: "error",
          payment_status: studentData[0].payment_status,
          message: "Unable to verify payment status",
        })
      }

      const data = await response.json()

      // If payment is now paid but not updated in our system
      if (data.order_status === "PAID" && studentData[0].payment_status !== "paid") {
        // Update the student record
        await supabase
          .from("students")
          .update({
            payment_status: "paid",
            transaction_id: data.cf_order_id,
            payment_details: JSON.stringify({
              order_status: data.order_status,
              cf_order_id: data.cf_order_id,
              order_amount: data.order_amount,
              verification_id: requestId,
            }),
          })
          .eq("order_id", orderId)

        return NextResponse.json({
          status: "success",
          payment_status: "paid",
          transaction_id: data.cf_order_id,
        })
      }

      // Return the current status from Cashfree
      return NextResponse.json({
        status: "pending",
        payment_status: data.order_status.toLowerCase(),
        message: "Payment is being processed",
      })
    }

    // If not using real payments, just return the current status
    return NextResponse.json({
      status: "pending",
      payment_status: studentData[0].payment_status,
      message: "Payment status is being checked",
    })
  } catch (error) {
    console.error("Payment status check error:", error)
    // SECURITY: Don't expose error details
    return NextResponse.json({ status: "error", message: "Failed to check payment status" }, { status: 500 })
  }
}

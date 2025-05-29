import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_ANON_KEY || ""
const cashfreeAppId = process.env.CASHFREE_APP_ID || ""
const cashfreeSecretKey = process.env.CASHFREE_SECRET_KEY || ""
const useRealPaymentApi = process.env.NEXT_PUBLIC_USE_REAL_PAYMENT_API === "true"

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate and sanitize input
    const { amount, orderId, studentName, email, phone, paymentMethod } = validateAndSanitizeInput(body)

    // Generate a unique request ID for tracking
    const requestId = crypto.randomUUID()

    // Log the payment request
    await supabase.from("payment_logs").insert({
      order_id: orderId,
      amount: amount,
      student_name: studentName || null,
      email: email || null,
      phone: phone || null,
      status: "INITIATED",
      payment_method: paymentMethod || "MOCK",
      request_id: requestId,
    })

    // Check if we should use real payment API
    if (useRealPaymentApi && cashfreeAppId && cashfreeSecretKey) {
      try {
        // Create order with Cashfree
        const cashfreeResponse = await createCashfreeOrder(orderId, amount, studentName, email, phone)

        return NextResponse.json({
          success: true,
          useRealPayment: true,
          paymentLink: cashfreeResponse.paymentLink,
          orderId: orderId,
          transactionId: cashfreeResponse.cfOrderId,
        })
      } catch (error) {
        console.error("Cashfree API error:", error)
        return NextResponse.json(
          {
            success: false,
            message: "Payment gateway error. Please try again.",
          },
          { status: 500 },
        )
      }
    } else {
      // Use mock payment for testing
      return NextResponse.json({
        success: true,
        useRealPayment: false,
        message: "Using mock payment system",
        orderId,
        transactionId: `MOCK_${Date.now()}`,
      })
    }
  } catch (error) {
    console.error("Error processing payment request:", error)
    return NextResponse.json({ success: false, message: "Failed to process payment request" }, { status: 500 })
  }
}

// Input validation and sanitization function
function validateAndSanitizeInput(body: any) {
  // Validate amount
  if (!body.amount || typeof body.amount !== "number" || body.amount <= 0) {
    throw new Error("Invalid amount")
  }

  // Validate orderId
  if (!body.orderId || typeof body.orderId !== "string" || !/^[a-zA-Z0-9_-]+$/.test(body.orderId)) {
    throw new Error("Invalid order ID")
  }

  // Sanitize and validate email if provided
  let email = body.email || null
  if (email && (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    email = null // Invalidate if not proper format
  }

  // Sanitize and validate phone if provided
  let phone = body.phone || null
  if (phone && (typeof phone !== "string" || !/^\d{10,15}$/.test(phone.replace(/[^0-9]/g, "")))) {
    phone = null // Invalidate if not proper format
  }

  // Sanitize student name
  const studentName =
    body.studentName && typeof body.studentName === "string"
      ? body.studentName
          .slice(0, 100)
          .replace(/[<>]/g, "") // Basic XSS protection
      : null

  // Get payment method
  const paymentMethod = body.paymentMethod || "MOCK"

  return {
    amount: body.amount,
    orderId: body.orderId,
    studentName,
    email,
    phone,
    paymentMethod,
  }
}

// Function to create an order with Cashfree
async function createCashfreeOrder(
  orderId: string,
  amount: number,
  customerName?: string,
  email?: string,
  phone?: string,
) {
  const apiUrl = "https://sandbox.cashfree.com/pg/orders" // Use production URL in production

  const orderData = {
    order_id: orderId,
    order_amount: amount,
    order_currency: "INR",
    customer_details: {
      customer_id: `CUST_${Date.now()}`,
      customer_name: customerName || "Student",
      customer_email: email || "student@example.com",
      customer_phone: phone || "9999999999",
    },
    order_meta: {
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/confirmation?order_id={order_id}&order_token={order_token}`,
      notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/webhook`,
    },
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-version": "2022-09-01",
      "x-client-id": cashfreeAppId,
      "x-client-secret": cashfreeSecretKey,
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Cashfree API error: ${response.status} ${errorText}`)
  }

  return await response.json()
}

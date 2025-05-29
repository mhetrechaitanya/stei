import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer"


async function sendWelcomeEmail({
  to,
  firstName,
  amount,
  workshopDates,
  workshopTime,
  meetingLink,
  meetingId,
  meetingPassword,
}: {
  to: string
  firstName: string
  amount: string
  workshopDates: string
  workshopTime: string
  meetingLink: string
  meetingId: string
  meetingPassword: string
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: `"stei" <${process.env.SMTP_USER}>`,
      to,
      subject: "Workshop Confirmation – stei",
      html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9fafb; color: #333; padding: 0; margin: 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="background-color: #ffffff; padding: 20px 0; border-bottom: 1px solid #eee;">
              <div style="background-color: #ffffff; padding: 20px;">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/STEI-Logo-Final-y6nOYUE3jmODBGwK7QJbttdpZZEGTm.png" alt="stei logo" style="width: 150px;" />
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <tr>
                  <td>
                    <h2 style="color: #D40F14;">Dear ${firstName},</h2>
                    <p style="font-size: 16px; line-height: 1.6;">
                      Thank you for registering for our IACE workshop.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6;">
                      We have received the payment of amount ₹${amount}.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6;">
                      You have registered for the workshop on date(s): <strong>${workshopDates} at ${workshopTime}</strong>.
                    </p>
                    <h3 style="margin-top: 25px;">Here is your Zoom meeting link:</h3>
                    <p>
                      <a href="${meetingLink}" style="color: #D40F14;">${meetingLink}</a><br/>
                      Meeting ID: <strong>${meetingId}</strong><br/>
                      Password: <strong>${meetingPassword}</strong>
                    </p>

                    <p style="margin-top: 25px;">Wishing you all the best.<br/>Happy learning!</p>

                    <p style="margin-top: 20px;">
                      Warmly,<br />
                      <strong>stei</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color: #ffffff; padding: 20px; color: #555; font-size: 13px;">
              <p style="margin: 0;">
                &copy; ${new Date().getFullYear()} stei. All rights reserved.
              </p>
              <p style="margin: 5px 0;">
                <a href="https://stei.pro" style="color: #D40F14; text-decoration: none;">Website</a> |
                <a href="https://www.instagram.com/stei_edutech/" style="color: #D40F14; text-decoration: none;">Instagram</a> |
                <a href="mailto:support@stei.com" style="color: #D40F14; text-decoration: none;">Contact Us</a>
              </p>
            </td>
          </tr>
        </table>
      </div>
      `, // Keep your full HTML content here
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`✅ Email sent to ${to} – Message ID: ${info.messageId}`)
    return true
  } catch (err) {
    console.error(`❌ Failed to send welcome email to ${to}:`, err)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid orderId" },
        { status: 400 }
      );
    }

    const appId = process.env.CASHFREE_APP_ID!;
    const secret = process.env.CASHFREE_SECRET_KEY!;
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

    const headers = {
      "x-client-id": appId,
      "x-client-secret": secret,
      "x-api-version": "2023-08-01",
      "Content-Type": "application/json",
    };

    const orderRes = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      { method: "GET", headers }
    );
    const orderDetails = await orderRes.json();

    if (!orderRes.ok || !orderDetails?.order_id) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch order" },
        { status: orderRes.status }
      );
    }

    let orderTags: any = {};
    try {
      orderTags =
        typeof orderDetails.order_tags === "string"
          ? JSON.parse(orderDetails.order_tags)
          : orderDetails.order_tags || {};
    } catch (err) {
      console.warn("Error parsing order_tags:", err);
    }

    const workshopId = orderTags.workshopId || orderTags.workshop_id;
    const batchId = orderTags.batchId || orderTags.batch_id;
    console.log("orderDetails :", orderDetails);
    const studentId = orderDetails.customer_details.customer_id;

    if (!studentId || !workshopId || !batchId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing workshopId or batchId in order_tags",
          order_tags: orderTags,
        },
        { status: 400 }
      );
    }

    const paymentRes = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`,
      { method: "GET", headers }
    );
    const payments = await paymentRes.json();
    const payment = Array.isArray(payments) ? payments[0] : null;

    if (
      !payment ||
      !["SUCCESS", "PAID", "CAPTURED", "COMPLETED"].includes(
        payment.payment_status
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not completed",
          order_status: orderDetails.order_status,
        },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
   
let enrollment;
try {
  const insertResult = await supabase
    .from("enrollments")
    .insert([{
      student_id: studentId,
      batch_id: batchId,
      enrollment_date: new Date().toISOString(),
      payment_status: "completed"
      // created_at: new Date().toISOString(),
    }])
    .select();

  if (insertResult.error || !insertResult.data?.length) {
    console.error("Supabase insert error:", insertResult.error);
    return NextResponse.json({
      success: false,
      message: "Failed to create enrollment",
      error: insertResult.error?.message || "Unknown Supabase error"
    }, { status: 500 });
  }

  enrollment = insertResult.data[0];
} catch (err: any) {
  console.error("Exception during enrollment insert:", err);
  return NextResponse.json({
    success: false,
    message: "Enrollment insert error",
    error: err?.message || "Unexpected exception"
  }, { status: 500 });
}

    try {
      await supabase.rpc("increment_enrollment", { p_batch_id: batchId });
    } catch (rpcError) {
      console.warn("Failed to increment batch enrollment count:", rpcError);
    }

    const { data: student } = await supabase
      .from("students")
      .select("first_name, email")
      .eq("id", studentId)
      .single();

    console.log("Student data:", student);

    const { data: batch } = await supabase
      .from("batches")
      .select("zoom_link, zoom_id, zoom_password, start_date, start_time")
      .eq("id", batchId)
      .single();

      console.log("Batch data:", batch);

    if (student && batch) {
      try {
        await sendWelcomeEmail({
          to: student.email,
          firstName: student.first_name,
          amount: orderDetails.order_amount.toString(),
          workshopDates: batch.start_date || "N/A",
          workshopTime: batch.start_time || "N/A",
          meetingLink: batch.zoom_link || "",
          meetingId: batch.zoom_id || "",
          meetingPassword: batch.zoom_password || "",
        });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }
    }

    await supabase.from("payments").insert([
      {
        order_id: orderId,
        enrollment_id: enrollment.id,
        amount: orderDetails.order_amount,
        payment_date: new Date().toISOString(),
        payment_method: payment.payment_method,
        status: payment.payment_status,
        transaction_id: payment.cf_payment_id,
        created_at: new Date().toISOString(),
      },
    ]);

    return NextResponse.json({
      success: true,
      // message: "Enrollment and payment recorded, email sent",
      // enrollment,
      // transaction_id: payment.cf_payment_id,
      //       success: true,
      order_id: orderId,
      transaction_id: payment.cf_payment_id,
      payment_status: payment.payment_status,
      payment_method: payment.payment_method,
      transaction_time: payment.payment_time,
      amount: orderDetails.order_amount,
      batch:batch,
      // workshop_id: workshopId,
      // batch_id: batchId,
      // enrollment_id: enrollment.id,
      orderDetails
    });
  } catch (error: any) {
    console.error("[Verify] Unhandled error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

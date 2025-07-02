import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ Send Confirmation Email
async function sendWelcomeEmail({
  to,
  firstName,
  batchDate,
  batchTime,
  meetingLink,
  meetingId,
  meetingPassword,
  workshopTitle,
}: {
  to: string;
  firstName: string;
  batchDate: string;
  batchTime: string;
  meetingLink: string;
  meetingId: string;
  meetingPassword: string;
  workshopTitle: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER_WORKSHOP,
        pass: process.env.SMTP_PASS_WORKSHOP,
      },
    });

    await transporter.sendMail({
      from: `"stei" <${process.env.SMTP_USER_WORKSHOP}>`,
      to,
      subject: `Workshop Confirmation – ${workshopTitle}`,
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
              <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <tr>
                  <td>
                    <h2 style="color: #D40F14;">Dear ${firstName},</h2>
                    <p style="font-size: 16px; line-height: 1.6;">Thank you for registering for <strong>${workshopTitle}</strong>.</p>
                    <p style="font-size: 16px; line-height: 1.6;">Your workshop is scheduled on: <strong>${batchDate} at ${batchTime}</strong>.</p>

                    <h3 style="margin-top: 25px;">Zoom Meeting Details:</h3>
                    <p>
                      <a href="${meetingLink}" style="color: #D40F14;">Join Meeting</a><br/>
                      Meeting ID: <strong>${meetingId}</strong><br/>
                      Password: <strong>${meetingPassword}</strong>
                    </p>

                    <p style="margin-top: 25px;">Wishing you all the best. Happy learning!</p>
                    <p style="margin-top: 20px;">Warmly,<br/><strong>stei</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color: #ffffff; padding: 20px; color: #555; font-size: 13px;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} stei. All rights reserved.</p>
              <p style="margin: 5px 0;">
                <a href="https://stei.pro" style="color: #D40F14; text-decoration: none;">Website</a> |
                <a href="https://www.instagram.com/stei_edutech/" style="color: #D40F14; text-decoration: none;">Instagram</a> |
                <a href="mailto:support@stei.com" style="color: #D40F14; text-decoration: none;">Contact Us</a>
              </p>
            </td>
          </tr>
        </table>
      </div>`,
    });

    return true;
  } catch (err) {
    console.error("❌ Email send failed:", err);
    return false;
  }
}

// ✅ Main API Handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, batchId, paymentStatus } = body;

    if (!studentId || !batchId) {
      return NextResponse.json({
        success: false,
        message: "Missing studentId or batchId",
      }, { status: 400 });
    }

    // Insert enrollment
    const { data: enrollmentData, error: insertError } = await supabase
      .from("enrollments")
      .insert([{
        student_id: studentId,
        batch_id: batchId,
        enrollment_date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        payment_status: paymentStatus || "completed",
      }])
      .select();

    if (insertError || !enrollmentData?.length) {
      return NextResponse.json({
        success: false,
        message: "Failed to create enrollment",
        error: insertError?.message || "Unknown error"
      }, { status: 500 });
    }

    // Get student details
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("first_name, email")
      .eq("id", studentId)
      .single();

    // Get batch + workshop ID
    const { data: batch, error: batchError } = await supabase
      .from("batches")
      .select("start_date, start_time, zoom_link, zoom_id, zoom_password, workshop_id")
      .eq("id", batchId)
      .single();

    if (!student || studentError || !batch || batchError) {
      return NextResponse.json({
        success: false,
        message: "Error fetching student or batch",
        error: studentError?.message || batchError?.message || "Unknown error",
      }, { status: 500 });
    }

    // Get workshop title
    const { data: workshop, error: workshopError } = await supabase
      .from("workshops")
      .select("title")
      .eq("id", batch.workshop_id)
      .single();

    const workshopTitle = workshop?.title || "Workshop";

    // Send Email
    const emailSent = await sendWelcomeEmail({
      to: student.email,
      firstName: student.first_name,
      batchDate: batch.start_date || "N/A",
      batchTime: batch.start_time || "N/A",
      meetingLink: batch.zoom_link || "#",
      meetingId: batch.zoom_id || "-",
      meetingPassword: batch.zoom_password || "-",
      workshopTitle,
    });
    if (!emailSent) {
      console.warn("Enrollment created, but confirmation email failed to send.");
    }

    return NextResponse.json({
      success: true,
      message: "Enrollment created and email sent",
      enrollment: enrollmentData[0],
      emailSent,
    });

  } catch (error: any) {
    console.error("❌ Server error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: error.message,
    }, { status: 500 });
  }
}

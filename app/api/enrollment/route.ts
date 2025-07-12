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

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Workshop Enrollment Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .meeting-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to ${workshopTitle}!</h1>
            <p>Your enrollment has been confirmed</p>
          </div>
          
          <div class="content">
            <p>Dear ${firstName},</p>
            
            <p>Congratulations! You have successfully enrolled in <strong>${workshopTitle}</strong>.</p>
            
            <div class="meeting-info">
              <h3>📅 Workshop Details:</h3>
              <p><strong>Date:</strong> ${batchDate}</p>
              <p><strong>Time:</strong> ${batchTime}</p>
              <p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
              <p><strong>Meeting ID:</strong> ${meetingId}</p>
              <p><strong>Password:</strong> ${meetingPassword}</p>
            </div>
            
            <p>We're excited to have you join us for this learning experience!</p>
            
            <a href="${meetingLink}" class="button">Join Workshop</a>
            
            <p>If you have any questions, please don't hesitate to reach out to us.</p>
            
            <p>Best regards,<br>The STEI Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"STEI Workshop" <${process.env.SMTP_USER_WORKSHOP}>`,
      to,
      subject: `Welcome to ${workshopTitle} - Enrollment Confirmed`,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
}

// ✅ Create enrollments table if it doesn't exist
async function ensureEnrollmentsTable() {
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS enrollments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL,
        batch_id UUID NOT NULL,
        enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
        payment_status TEXT DEFAULT 'completed',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      );
    `;

    // First, try to create the exec_sql function if it doesn't exist
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$;
    `;

    try {
      await supabase.rpc('exec_sql', { sql_query: createFunctionSQL });
    } catch (functionError) {
      console.log("exec_sql function may already exist or couldn't be created:", functionError);
    }

    // Now try to create the enrollments table
    const { error } = await supabase.rpc('exec_sql', { sql_query: createTableSQL });
    if (error) {
      console.error("Error creating enrollments table:", error);
      
      // If exec_sql doesn't work, try creating the table directly
      try {
        const { error: directError } = await supabase
          .from('enrollments')
          .select('id')
          .limit(1);
        
        if (directError && directError.code === '42P01') {
          // Table doesn't exist, but we can't create it with exec_sql
          console.error("enrollments table doesn't exist and can't be created automatically");
          return false;
        }
      } catch (directCheckError) {
        console.error("Error checking enrollments table existence:", directCheckError);
        return false;
      }
      
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error ensuring enrollments table:", error);
    return false;
  }
}

// ✅ Main API Handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Enrollment request body:", body);
    
    const { studentId, batchId, workshopId, paymentStatus, orderId, transactionId, amount } = body;

    if (!studentId || !batchId) {
      return NextResponse.json({
        success: false,
        message: "Missing studentId or batchId",
      }, { status: 400 });
    }

    // Ensure enrollments table exists
    await ensureEnrollmentsTable();

    // Check if student is already enrolled in this batch
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", studentId)
      .eq("batch_id", batchId)
      .single();

    if (existingEnrollment) {
      return NextResponse.json({
        success: false,
        message: "Student is already enrolled in this batch",
        alreadyEnrolled: true
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
      console.error("Enrollment insert error:", insertError);
      return NextResponse.json({
        success: false,
        message: "Failed to create enrollment",
        error: insertError?.message || "Unknown error"
      }, { status: 500 });
    }

    // Get student details - try both name and first_name fields
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("first_name, last_name, email")
      .eq("id", studentId)
      .single();

    if (studentError || !student) {
      console.error("Student fetch error:", studentError);
      return NextResponse.json({
        success: false,
        message: "Error fetching student details",
        error: studentError?.message || "Student not found",
      }, { status: 500 });
    }

    // Get batch details - use workshop_batches table
    const { data: batch, error: batchError } = await supabase
      .from("batches")
      .select("start_date, start_time, workshop_id,zoom_link,zoom_password,zoom_id")
      .eq("id", batchId)
      .single();

    if (batchError || !batch) {
      console.error("Batch fetch error:", batchError);
      return NextResponse.json({
        success: false,
        message: "Error fetching batch details",
        error: batchError?.message || "Batch not found",
      }, { status: 500 });
    }

    // Get workshop title
    const { data: workshop, error: workshopError } = await supabase
      .from("workshops")
      .select("name")
      .eq("id", batch.workshop_id)
      .single();

    const workshopTitle = workshop?.name || "Workshop";

    // Prepare student name
    const studentName = student.first_name || "Student";

    // Send Email
    const emailSent = await sendWelcomeEmail({
      to: student.email,
      firstName: studentName,
      batchDate: batch.start_date || "N/A",
      batchTime: batch.start_time || "N/A",
      meetingLink: batch.zoom_link || "N/A", // Add zoom link when available
      meetingId: batch.zoom_id || "N/A",
      meetingPassword: batch.zoom_password || "N/A",
      workshopTitle,
    });

    if (!emailSent) {
      console.warn("Enrollment created, but confirmation email failed to send.");
    }

    // Try to increment batch enrollment count
    // try {
    //   // First get current enrollment count
    //   const { data: currentBatch } = await supabase
    //     .from("batches")
    //     .select("enrolled")
    //     .eq("id", batchId)
    //     .single();
      
    //   const newEnrolledCount = (currentBatch?.enrolled || 0) + 1;
      
    //   const { error: updateError } = await supabase
    //     .from("workshop_batches")
    //     .update({ enrolled: newEnrolledCount })
    //     .eq("id", batchId);
      
    //   if (updateError) {
    //     console.warn("Failed to increment batch enrollment count:", updateError);
    //   }
    // } catch (updateErr) {
    //   console.warn("Failed to increment batch enrollment count:", updateErr);
    // }

    return NextResponse.json({
      success: true,
      message: "Enrollment created successfully",
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

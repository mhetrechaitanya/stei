import { NextResponse } from "next/server"
import { recordSentEmail } from "@/app/actions/email-actions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { emails, templateId } = body

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "No valid emails provided" }, { status: 400 })
    }

    // In a production environment, you would connect to an email service here
    // For now, we'll just record the emails in the database

    const results = []

    for (const email of emails) {
      // Validate email data
      if (!email.to || !email.subject || !email.body) {
        results.push({
          to: email.to,
          success: false,
          error: "Missing required fields",
        })
        continue
      }

      // Record the email in the database
      const { success, error } = await recordSentEmail({
        recipient_email: email.to,
        recipient_name: email.studentName,
        subject: email.subject,
        body: email.body,
        template_id: templateId,
      })

      results.push({
        to: email.to,
        success,
        error: error || null,
      })
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error sending emails:", error)
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
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
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`✅ Email sent to ${to} – Message ID: ${info.messageId}`)
    return true
  } catch (err) {
    console.error(`❌ Failed to send welcome email to ${to}:`, err)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, first_name, amount, workshop_dates, meeting_link, meeting_id, meeting_password } = body

    if (!email || !first_name || !amount || !workshop_dates || !meeting_link || !meeting_id || !meeting_password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const sent = await sendWelcomeEmail({
      to: email,
      firstName: first_name,
      amount,
      workshopDates: workshop_dates,
      workshopTime: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }),
      meetingLink: meeting_link,
      meetingId: meeting_id,
      meetingPassword: meeting_password,
    })

    if (!sent) {
      return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (err) {
    console.error("❌ API error:", err)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}

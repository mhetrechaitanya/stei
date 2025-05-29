// /app/api/send-welcome-email/route.ts

import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

async function sendWelcomeEmail(to: string, firstName: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"stei" <${process.env.SMTP_USER}>`,
      to,
      subject: "Welcome to stei – Your Growth Journey Begins Here",
      html: `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9fafb; color: #333; padding: 0; margin: 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="background-color: #ffffff; padding: 20px 0; border-bottom: 1px solid #eee;">
  <div style="background-color: #ffffff; padding: 20px;">
    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/STEI-Logo-Final-y6nOYUE3jmODBGwK7QJbttdpZZEGTm.png"alt="stei logo" style="width: 150px;" />
  </div>
</td>

      </tr>

      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <tr>
              <td>
                <h2 style="color: #D40F14;">Hi ${firstName},</h2>
                <p style="font-size: 16px; line-height: 1.6;">
                  Welcome to <strong>stei</strong> – we're so glad you’re here!
                </p>
                <p style="font-size: 16px; line-height: 1.6;">
                  You’ve just taken a meaningful step toward discovering your strengths, building confidence, and unlocking new possibilities. At stei, we’re committed to helping individuals like you grow through personalised coaching, transformative workshops, and a lot of real, reflective conversation.
                </p>

                <h3 style="margin-top: 30px; color: #333;">What you get:</h3>
                <ul style="padding-left: 20px; font-size: 16px; line-height: 1.6;">
                  <li>Invitations to impactful workshops and events</li>
                  <li>Thoughtful content designed to inspire and equip you</li>
                  <li>Opportunities for coaching and personal development</li>
                  <li>A space to grow at your own pace – supported, not pressured</li>
                </ul>

                <p style="font-size: 16px; line-height: 1.6;">
                  <strong>Bonus:</strong> As a registered member, you're automatically eligible to attend all our free webinars without registering separately. Keep an eye on your inbox!
                </p>

                <p style="font-size: 16px; line-height: 1.6;">
                  We’d love to get to know you better and guide you to programs that fit your goals. Until then, explore our offerings and feel free to connect with us anytime.
                </p>

                <div style="margin: 30px 0;">
                  <a href="https://stei.pro/" style="background-color: #D40F14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Explore stei
                  </a>
                </div>

                <p style="font-size: 14px; color: #555;">Let’s make this journey transformative and enjoyable.</p>

                <p style="margin-top: 20px;">
                  Warmly,<br />
                  <strong>Team stei</strong><br />
                  Skilling. Transforming. Empowering Individuals.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td align="center" style="background-color: #1f1f1f; padding: 20px; color: #bbb; font-size: 13px;">
          <p style="margin: 0;">
            &copy; ${new Date().getFullYear()} stei. All rights reserved.
          </p>
          <p style="margin: 5px 0;">
            <a href="https://stei.pro" style="color: #f3f3f3; text-decoration: none;">Website</a> |
            <a href="https://www.instagram.com/stei_edutech/" style="color: #f3f3f3; text-decoration: none;">Instagram</a> |
            <a href="mailto:support@stei.com" style="color: #f3f3f3; text-decoration: none;">Contact Us</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to} – Message ID: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to send welcome email to ${to}:`, err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, first_name } = body;

    if (!email || !first_name) {
      return NextResponse.json(
        { success: false, error: "Missing email or first name" },
        { status: 400 }
      );
    }

    const sent = await sendWelcomeEmail(email, first_name);

    if (!sent) {
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    console.error("❌ API error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

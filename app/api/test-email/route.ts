import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function GET() {
  return POST();
}

export async function POST(request?: NextRequest) {
  try {
    console.log("Testing email with API key:", process.env.RESEND_API_KEY?.substring(0, 8) + "...")
    console.log("FROM_EMAIL:", process.env.FROM_EMAIL)
    
    let targetEmail = 'vtkatugampala@gmail.com'
    
    if (request) {
      try {
        const body = await request.json()
        if (body.email) {
          targetEmail = body.email
        }
      } catch (e) {
        // Ignore JSON parsing errors for GET requests
      }
    }
    
    console.log("Sending test email to:", targetEmail)
    
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: [targetEmail],
      subject: 'TodoFlow - Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>🎉 Email Working!</h2>
          <p>This is a test email from your TodoFlow app.</p>
          <p>Sent to: ${targetEmail}</p>
          <p>If you're seeing this, your email configuration is working correctly!</p>
          <p>Time sent: ${new Date().toLocaleString()}</p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("Email sent successfully:", data)
    return NextResponse.json({ success: true, data, sentTo: targetEmail })
  } catch (error) {
    console.error("Email sending failed:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
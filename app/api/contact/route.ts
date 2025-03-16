import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, company, message } = await request.json();

    // Validate the data
    if (!name || !email || !company) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prepare email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Message:</strong></p>
      <p>${message || 'No message provided'}</p>
    `;

    // Send email using Resend API directly with fetch
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Contact Form <onboarding@resend.dev>',
        to: 'abhinandan.shekar@leapofpi.com', // CHANGE THIS to your email
        subject: `New Contact Form Submission from ${name}`,
        html: emailContent
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Resend API error: ${errorData.message || response.status}`);
    }

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully. We'll be in touch soon."
    });
  } catch (error) {
    console.error("Error processing form:", error);
    return NextResponse.json({ error: "Failed to process form submission" }, { status: 500 });
  }
}

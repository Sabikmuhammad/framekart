import { NextRequest, NextResponse } from "next/server";
import { ContactFormSchema } from "@/lib/validation";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedData = ContactFormSchema.parse(body);
    const { name, email, subject, message } = validatedData;

    // TODO: Implement email sending via Resend
    // For now, log the contact form submission
    if (process.env.NODE_ENV === 'development') {
      console.log('Contact form submission:', { name, email, subject });
    }

    // Store in database or send email
    // await sendContactEmail({ name, email, subject, message });

    return NextResponse.json({ 
      success: true, 
      message: "Your message has been received. We'll get back to you within 24 hours." 
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid form data. Please check your inputs.",
          details: process.env.NODE_ENV === 'development' ? error.errors : undefined
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to send message. Please try again.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

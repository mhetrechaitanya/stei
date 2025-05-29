import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/utils/supabase-server"

export async function POST(request: Request) {
  try {
    const template = await request.json()

    // Validate the template data
    if (!template.name || !template.subject || !template.body) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    // Ensure the table exists
    const { error: tableCheckError } = await supabase.from("email_templates").select("id").limit(1)

    if (tableCheckError) {
      // Create email_templates table if it doesn't exist
      const { error: createTableError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS email_templates (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      })

      if (createTableError) {
        console.error("Error creating email_templates table:", createTableError)
        return NextResponse.json({ success: false, error: "Failed to create email templates table" }, { status: 500 })
      }
    }

    // Insert or update the template
    let result

    if (template.id) {
      // Update existing template
      result = await supabase
        .from("email_templates")
        .update({
          name: template.name,
          subject: template.subject,
          body: template.body,
          updated_at: new Date().toISOString(),
        })
        .eq("id", template.id)
        .select()
    } else {
      // Insert new template
      result = await supabase
        .from("email_templates")
        .insert({
          name: template.name,
          subject: template.subject,
          body: template.body,
        })
        .select()
    }

    if (result.error) {
      console.error("Error saving template:", result.error)
      return NextResponse.json({ success: false, error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error in template API:", error)
    return NextResponse.json({ success: false, error: error.message || "Unknown error occurred" }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log("GET /api/email/templates - Fetching templates")
    const supabase = await getSupabaseServer()

    // Check if email_templates table exists
    const { error: tableCheckError } = await supabase.from("email_templates").select("id").limit(1)

    if (tableCheckError) {
      console.log("Table check error:", tableCheckError.message)
      // Create email_templates table if it doesn't exist
      const { error: createTableError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS email_templates (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Insert default template if table was just created
          INSERT INTO email_templates (name, subject, body)
          VALUES (
            'Welcome Email',
            'Welcome to the {{workshop}} Workshop!',
            'Dear {{name}},\n\nWelcome to the {{workshop}} workshop! We''re excited to have you join us.\n\nYour workshop is scheduled for {{date}} at {{time}}.\n\nPlease let us know if you have any questions.\n\nBest regards,\nSTEI Team'
          );
        `,
      })

      if (createTableError) {
        console.error("Error creating email_templates table:", createTableError)
        return NextResponse.json({ success: false, error: "Failed to create email templates table" }, { status: 500 })
      }

      // After creating the table, wait a moment for the database to process
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Get all email templates
    console.log("Fetching email templates from database")
    const { data, error } = await supabase.from("email_templates").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching email templates:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log(`Successfully fetched ${data?.length || 0} email templates`)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ success: false, error: error.message || "Unknown error occurred" }, { status: 500 })
  }
}

"use server"

import { createClient } from "@/lib/supabase-server"

export async function getEmailTemplates() {
  try {
    console.log("Starting getEmailTemplates server action")
    const supabase = await createClient()

    // Check if email_templates table exists
    console.log("Checking if email_templates table exists")
    const { error: tableCheckError } = await supabase.from("email_templates").select("id").limit(1)

    if (tableCheckError) {
      console.log("Table check error:", tableCheckError.message)
      // Create email_templates table if it doesn't exist
      console.log("Creating email_templates table")
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
        return { data: [], error: "Failed to create email templates table" }
      }

      // After creating the table, wait a moment for the database to process
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Get all email templates
    console.log("Fetching email templates")
    const { data, error } = await supabase.from("email_templates").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching email templates:", error)
      return { data: [], error: error.message }
    }

    console.log(`Successfully fetched ${data?.length || 0} email templates`)
    return { data, error: null }
  } catch (error) {
    console.error("Error in getEmailTemplates:", error)
    return { data: [], error: "Internal server error" }
  }
}

export async function saveEmailTemplate(template: { name: string; subject: string; body: string; id?: number }) {
  try {
    const supabase = await createClient()

    // Add more detailed logging
    console.log("Saving email template:", JSON.stringify(template, null, 2))

    // First, ensure the table exists
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
        `,
      })

      if (createTableError) {
        console.error("Error creating email_templates table:", createTableError)
        return { success: false, error: "Failed to create email templates table: " + createTableError.message }
      }
    }

    // Sanitize the template data to prevent SQL injection
    const sanitizedTemplate = {
      name: template.name?.trim() || "Untitled Template",
      subject: template.subject?.trim() || "",
      body: template.body || "",
    }

    if (template.id) {
      // Update existing template
      console.log(`Updating template with ID: ${template.id}`)
      const { data, error } = await supabase
        .from("email_templates")
        .update({
          name: sanitizedTemplate.name,
          subject: sanitizedTemplate.subject,
          body: sanitizedTemplate.body,
          updated_at: new Date().toISOString(),
        })
        .eq("id", template.id)
        .select()

      if (error) {
        console.error("Error updating email template:", error)
        return { success: false, error: error.message }
      }

      return { success: true, data, error: null }
    } else {
      // Insert new template
      console.log("Inserting new template")
      const { data, error } = await supabase
        .from("email_templates")
        .insert({
          name: sanitizedTemplate.name,
          subject: sanitizedTemplate.subject,
          body: sanitizedTemplate.body,
        })
        .select()

      if (error) {
        console.error("Error inserting email template:", error)
        return { success: false, error: error.message }
      }

      return { success: true, data, error: null }
    }
  } catch (error) {
    // Improve error logging with full details
    console.error("Error in saveEmailTemplate:", error)
    console.error("Error stack:", error.stack)
    return { success: false, error: `Internal server error: ${error.message}` }
  }
}

export async function deleteEmailTemplate(id: number) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("email_templates").delete().eq("id", id)

    if (error) {
      console.error("Error deleting email template:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteEmailTemplate:", error)
    return { success: false, error: "Internal server error" }
  }
}

export async function getSentEmails() {
  try {
    const supabase = await createClient()

    // Check if emails table exists
    const { error: tableCheckError } = await supabase.from("emails").select("id").limit(1)

    if (tableCheckError) {
      // Create emails table if it doesn't exist
      const { error: createTableError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS emails (
            id SERIAL PRIMARY KEY,
            recipient_email TEXT NOT NULL,
            recipient_name TEXT,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            status TEXT DEFAULT 'sent',
            template_id INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      })

      if (createTableError) {
        console.error("Error creating emails table:", createTableError)
        return { data: [], error: "Failed to create emails table" }
      }

      // Return empty array since table was just created
      return { data: [], error: null }
    }

    // Get all sent emails
    const { data, error } = await supabase.from("emails").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching sent emails:", error)
      return { data: [], error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in getSentEmails:", error)
    return { data: [], error: "Internal server error" }
  }
}

export async function recordSentEmail(email: {
  recipient_email: string
  recipient_name?: string
  subject: string
  body: string
  template_id?: number
}) {
  try {
    const supabase = await createClient()

    // Check if emails table exists
    const { error: tableCheckError } = await supabase.from("emails").select("id").limit(1)

    if (tableCheckError) {
      // Create emails table if it doesn't exist
      const { error: createTableError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS emails (
            id SERIAL PRIMARY KEY,
            recipient_email TEXT NOT NULL,
            recipient_name TEXT,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            status TEXT DEFAULT 'sent',
            template_id INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      })

      if (createTableError) {
        console.error("Error creating emails table:", createTableError)
        return { success: false, error: "Failed to create emails table" }
      }
    }

    // Insert email record
    const { data, error } = await supabase
      .from("emails")
      .insert({
        recipient_email: email.recipient_email,
        recipient_name: email.recipient_name || null,
        subject: email.subject,
        body: email.body,
        template_id: email.template_id || null,
      })
      .select()

    if (error) {
      console.error("Error recording sent email:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Error in recordSentEmail:", error)
    return { success: false, error: "Internal server error" }
  }
}

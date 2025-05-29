import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing Supabase credentials",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if the table already exists
    const { error: checkError } = await supabase.from("quotes").select("id").limit(1)

    if (!checkError) {
      return NextResponse.json({
        success: true,
        message: "Quotes table already exists",
      })
    }

    // Create the quotes table
    const { error } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS quotes (
          id SERIAL PRIMARY KEY,
          quote TEXT NOT NULL,
          author VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          color VARCHAR(50),
          is_featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `,
    })

    if (error) {
      console.error("Error creating quotes table:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create quotes table",
          error: error.message,
        },
        { status: 500 },
      )
    }

    // Add some initial quotes
    const { error: seedError } = await supabase.rpc("exec_sql", {
      sql_query: `
        INSERT INTO quotes (quote, author, category, is_featured)
        VALUES 
          ('The only way to do great work is to love what you do.', 'Steve Jobs', 'Motivation', true),
          ('Believe you can and you''re halfway there.', 'Theodore Roosevelt', 'Inspiration', true),
          ('It does not matter how slowly you go as long as you do not stop.', 'Confucius', 'Perseverance', false),
          ('Success is not final, failure is not fatal: It is the courage to continue that counts.', 'Winston Churchill', 'Success', false),
          ('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 'Dreams', true),
          ('The best way to predict the future is to create it.', 'Peter Drucker', 'Future', false);
      `,
    })

    if (seedError) {
      console.error("Error seeding quotes table:", seedError)
      return NextResponse.json({
        success: true,
        message: "Quotes table created but failed to add initial quotes",
        error: seedError.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Quotes table created and seeded successfully",
    })
  } catch (error) {
    console.error("Error in setup-quotes-table route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
        error: String(error),
      },
      { status: 500 },
    )
  }
}

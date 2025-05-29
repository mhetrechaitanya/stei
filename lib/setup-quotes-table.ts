import { getSupabaseClient } from "@/lib/supabase-client"

export async function setupQuotesTable() {
  try {
    const supabase = getSupabaseClient()

    // Try to create the quotes table directly with SQL
    const { error } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS quotes (
          id SERIAL PRIMARY KEY,
          text TEXT NOT NULL,
          author VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Add some sample quotes if the table is empty
        INSERT INTO quotes (text, author, category)
        SELECT 
          'The only way to do great work is to love what you do.', 
          'Steve Jobs', 
          'motivation'
        WHERE NOT EXISTS (SELECT 1 FROM quotes LIMIT 1);
        
        INSERT INTO quotes (text, author, category)
        SELECT 
          'Success is not final, failure is not fatal: It is the courage to continue that counts.', 
          'Winston Churchill', 
          'success'
        WHERE NOT EXISTS (SELECT 1 FROM quotes LIMIT 1);
        
        INSERT INTO quotes (text, author, category)
        SELECT 
          'Education is the most powerful weapon which you can use to change the world.', 
          'Nelson Mandela', 
          'education'
        WHERE NOT EXISTS (SELECT 1 FROM quotes LIMIT 1);
      `,
    })

    if (error) {
      console.error("Error creating quotes table:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error in setupQuotesTable:", error)
    return { success: false, error: error.message }
  }
}

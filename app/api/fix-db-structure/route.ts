import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function POST() {
  try {
    const supabase = await getSupabaseServer()

    // First, check if the exec_sql function exists
    const { data: functionExists, error: functionCheckError } = await supabase
      .from("information_schema.routines")
      .select("routine_name")
      .eq("routine_schema", "public")
      .eq("routine_name", "exec_sql")
      .maybeSingle()

    // If exec_sql function doesn't exist, create it
    if (!functionExists || functionCheckError) {
      const createFunctionSql = `
        CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `

      // Execute raw SQL to create the function
      const { error: createFunctionError } = await supabase.rpc("exec_sql", { sql: createFunctionSql })

      if (createFunctionError) {
        // If we can't create the function, try direct SQL execution
        try {
          await supabase.query(createFunctionSql)
        } catch (directError) {
          return NextResponse.json(
            {
              success: false,
              message: "Failed to create exec_sql function",
              error: directError.message,
            },
            { status: 500 },
          )
        }
      }
    }

    // Create or fix the students table
    const createTableSql = `
      -- Create extension if it doesn't exist
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      -- Drop the table if it exists but has wrong structure
      DROP TABLE IF EXISTS students;
      
      -- Create students table with correct structure
      CREATE TABLE students (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        pincode TEXT,
        workshop_id UUID,
        batch_id UUID,
        payment_status TEXT DEFAULT 'pending',
        amount NUMERIC DEFAULT 0,
        transaction_id TEXT,
        affiliate TEXT,
        order_id TEXT,
        payment_details JSONB,
        workshop_name TEXT,
        batch_date TIMESTAMP WITH TIME ZONE,
        batch_time TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create indexes for faster lookups
      CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
      CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);
      CREATE INDEX IF NOT EXISTS idx_students_workshop_id ON students(workshop_id);
      CREATE INDEX IF NOT EXISTS idx_students_batch_id ON students(batch_id);
    `

    // Execute the SQL to create/fix the students table
    const { error: createTableError } = await supabase.rpc("exec_sql", { sql: createTableSql })

    if (createTableError) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create students table",
          error: createTableError.message,
        },
        { status: 500 },
      )
    }

    // Verify the table was created successfully
    const { data: tableCheck, error: tableCheckError } = await supabase.from("students").select("id").limit(1)

    if (tableCheckError) {
      return NextResponse.json(
        {
          success: false,
          message: "Table was created but verification failed",
          error: tableCheckError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database structure fixed successfully",
    })
  } catch (error) {
    console.error("Unexpected error fixing database structure:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

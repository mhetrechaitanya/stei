import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer()

    // SQL to fix permissions
    const sql = `
    -- Enable RLS on the students table if it exists
    DO $$
    BEGIN
      IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'students'
      ) THEN
        -- Enable RLS
        ALTER TABLE students ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS select_students ON students;
        DROP POLICY IF EXISTS select_students_auth ON students;
        DROP POLICY IF EXISTS manage_students ON students;
        
        -- Create policies
        CREATE POLICY select_students ON students
            FOR SELECT
            TO anon
            USING (true);
        
        CREATE POLICY select_students_auth ON students
            FOR SELECT
            TO authenticated
            USING (true);
        
        CREATE POLICY manage_students ON students
            FOR ALL
            TO service_role
            USING (true);
        
        -- Grant permissions
        GRANT SELECT ON students TO anon;
        GRANT SELECT, INSERT, UPDATE ON students TO authenticated;
        GRANT ALL ON students TO service_role;
      END IF;
    END
    $$;
    `

    // Try to execute the SQL
    try {
      const { error } = await supabase.rpc("exec_sql", { sql })

      if (error) {
        // If the exec_sql function doesn't exist, try direct query
        if (error.message.includes("function") && error.message.includes("does not exist")) {
          try {
            const { error: directError } = await supabase.query(sql)

            if (directError) {
              return NextResponse.json(
                {
                  success: false,
                  message: "Failed to fix permissions with direct query",
                  error: directError.message,
                },
                { status: 500 },
              )
            }
          } catch (directQueryError) {
            return NextResponse.json(
              {
                success: false,
                message: "Exception during direct query execution",
                error: directQueryError.message,
              },
              { status: 500 },
            )
          }
        } else {
          return NextResponse.json(
            {
              success: false,
              message: "Failed to fix permissions",
              error: error.message,
            },
            { status: 500 },
          )
        }
      }

      // Verify the fix worked by trying to query the students table
      const { data: verifyData, error: verifyError } = await supabase.from("students").select("id").limit(1)

      if (verifyError) {
        return NextResponse.json(
          {
            success: false,
            message: "Permissions fixed but verification failed",
            error: verifyError.message,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Permissions fixed successfully",
        verification: "Students table is now accessible",
      })
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error fixing permissions",
          error: error.message,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request",
        error: error.message,
      },
      { status: 400 },
    )
  }
}

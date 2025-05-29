import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json({ success: false, message: "SQL query is required" }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    // Try to execute the SQL directly
    try {
      const { data, error } = await supabase.rpc("exec_sql", { sql })

      if (error) {
        // If the exec_sql function doesn't exist, try to create it first
        if (error.message.includes("function") && error.message.includes("does not exist")) {
          const createFunctionSql = `
            CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS $$
            BEGIN
              EXECUTE sql;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
          `

          // Try to create the function
          try {
            await supabase.query(createFunctionSql)

            // Try executing the original SQL again
            const { error: retryError } = await supabase.rpc("exec_sql", { sql })

            if (retryError) {
              return NextResponse.json(
                {
                  success: false,
                  message: "Failed to execute SQL after creating exec_sql function",
                  error: retryError.message,
                },
                { status: 500 },
              )
            }
          } catch (createError) {
            return NextResponse.json(
              {
                success: false,
                message: "Failed to create exec_sql function",
                error: createError.message,
              },
              { status: 500 },
            )
          }
        } else {
          return NextResponse.json(
            {
              success: false,
              message: "Failed to execute SQL",
              error: error.message,
            },
            { status: 500 },
          )
        }
      }

      // Try to verify the students table exists now
      const { data: verifyData, error: verifyError } = await supabase.from("students").select("id").limit(1)

      if (verifyError) {
        return NextResponse.json(
          {
            success: false,
            message: "SQL executed but students table verification failed",
            error: verifyError.message,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "SQL executed successfully",
        verification: "Students table exists and is accessible",
      })
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error executing SQL",
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

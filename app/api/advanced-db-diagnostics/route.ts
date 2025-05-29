import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  try {
    // Get the Supabase client
    const supabase = await getSupabaseServer()

    const results = {
      connection: true,
      environmentVariables: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        serviceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      schemas: [],
      tables: {},
      permissions: {},
      rls: {},
      queries: {},
      errors: [],
    }

    // Check if we can list schemas
    try {
      const { data: schemas, error } = await supabase
        .from("information_schema.schemata")
        .select("schema_name")
        .not("schema_name", "in", "(pg_catalog,information_schema)")

      if (error) {
        results.errors.push({
          type: "schema_query",
          message: error.message,
          code: error.code,
        })
      } else {
        results.schemas = schemas.map((s) => s.schema_name)
      }
    } catch (error) {
      results.errors.push({
        type: "schema_query_exception",
        message: error.message,
      })
    }

    // Check if students table exists in any schema
    for (const schema of ["public", ...results.schemas]) {
      try {
        // Check if table exists in this schema
        const { data: tableExists, error: tableError } = await supabase
          .from("information_schema.tables")
          .select("table_name")
          .eq("table_schema", schema)
          .eq("table_name", "students")
          .maybeSingle()

        if (tableError) {
          results.errors.push({
            type: `table_check_${schema}`,
            message: tableError.message,
            code: tableError.code,
          })
        } else {
          results.tables[schema] = {
            exists: !!tableExists,
            columns: [],
          }

          // If table exists, check columns
          if (tableExists) {
            const { data: columns, error: columnsError } = await supabase
              .from("information_schema.columns")
              .select("column_name, data_type, is_nullable")
              .eq("table_schema", schema)
              .eq("table_name", "students")

            if (columnsError) {
              results.errors.push({
                type: `columns_check_${schema}`,
                message: columnsError.message,
                code: columnsError.code,
              })
            } else {
              results.tables[schema].columns = columns
            }

            // Try a direct query to the table
            const { data: queryData, error: queryError } = await supabase
              .from(`${schema}.students`)
              .select("id")
              .limit(1)

            results.queries[schema] = {
              success: !queryError,
              error: queryError ? queryError.message : null,
            }

            // Check RLS policies
            try {
              const { data: policies, error: policiesError } = await supabase
                .from("pg_policies")
                .select("*")
                .eq("tablename", "students")
                .eq("schemaname", schema)

              if (policiesError) {
                results.errors.push({
                  type: `rls_check_${schema}`,
                  message: policiesError.message,
                  code: policiesError.code,
                })
              } else {
                results.rls[schema] = policies || []
              }
            } catch (error) {
              results.errors.push({
                type: `rls_check_exception_${schema}`,
                message: error.message,
              })
            }
          }
        }
      } catch (error) {
        results.errors.push({
          type: `schema_${schema}_exception`,
          message: error.message,
        })
      }
    }

    // Try with service role if available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const serviceClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
        )

        const { data: serviceData, error: serviceError } = await serviceClient.from("students").select("id").limit(1)

        results.permissions.serviceRole = {
          success: !serviceError,
          error: serviceError ? serviceError.message : null,
        }
      } catch (error) {
        results.errors.push({
          type: "service_role_exception",
          message: error.message,
        })
      }
    }

    // Try with direct SQL query if possible
    try {
      const { data: sqlData, error: sqlError } = await supabase.rpc("exec_sql", {
        sql: "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'students')",
      })

      results.queries.sql = {
        success: !sqlError,
        data: sqlData,
        error: sqlError ? sqlError.message : null,
      }
    } catch (error) {
      results.errors.push({
        type: "sql_query_exception",
        message: error.message,
      })
    }

    return NextResponse.json({
      success: true,
      diagnostics: results,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to run diagnostics",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

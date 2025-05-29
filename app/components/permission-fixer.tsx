"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Loader2, Copy, ExternalLink, Shield, Key } from "lucide-react"

export default function PermissionFixer() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFixing, setIsFixing] = useState(false)
  const [fixResult, setFixResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const rlsFixScript = `-- Enable RLS on the students table
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anon users to select from the students table
CREATE POLICY select_students ON students
    FOR SELECT
    TO anon
    USING (true);

-- Create a policy that allows authenticated users to select from the students table
CREATE POLICY select_students_auth ON students
    FOR SELECT
    TO authenticated
    USING (true);

-- Create a policy that allows service_role to do everything
CREATE POLICY manage_students ON students
    FOR ALL
    TO service_role
    USING (true);`

  const grantPermissionsScript = `-- Grant permissions to the anon role
GRANT SELECT ON students TO anon;

-- Grant permissions to the authenticated role
GRANT SELECT, INSERT, UPDATE ON students TO authenticated;

-- Grant permissions to the service_role (if needed)
GRANT ALL ON students TO service_role;`

  const createTableScript = `-- Create extension if it doesn't exist
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

-- Insert a test record to verify the table works
INSERT INTO students (name, email, phone)
VALUES ('Test Student', 'test@example.com', '1234567890');

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

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
GRANT ALL ON students TO service_role;`

  const runDiagnostics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/advanced-db-diagnostics")
      const data = await response.json()

      if (data.success) {
        setDiagnostics(data.diagnostics)
      } else {
        setError(data.message || "Failed to run diagnostics")
      }
    } catch (err) {
      setError("Error running diagnostics: " + (err.message || "Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }

  const fixPermissions = async () => {
    setIsFixing(true)
    setError(null)
    setFixResult(null)

    try {
      const response = await fetch("/api/fix-permissions", {
        method: "POST",
      })
      const data = await response.json()

      setFixResult(data)

      if (data.success) {
        // Re-run diagnostics after fixing
        await runDiagnostics()
      } else {
        setError(data.message || "Failed to fix permissions")
      }
    } catch (err) {
      setError("Error fixing permissions: " + (err.message || "Unknown error"))
    } finally {
      setIsFixing(false)
    }
  }

  const copyToClipboard = (script) => {
    navigator.clipboard.writeText(script).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      },
      (err) => {
        console.error("Could not copy text: ", err)
      },
    )
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  // Determine what issues exist and what fixes to recommend
  const determineIssues = () => {
    if (!diagnostics) return null

    const issues = []

    // Check if table exists in any schema
    const tableExists = Object.values(diagnostics.tables).some((table: any) => table.exists)

    if (!tableExists) {
      issues.push({
        type: "missing_table",
        title: "Students Table Missing",
        description: "The students table does not exist in any schema.",
        solution: "Create the students table using the SQL script below.",
        script: createTableScript,
      })
    } else {
      // Check if we can query the table
      const canQuery = Object.values(diagnostics.queries).some((query: any) => query.success)

      if (!canQuery) {
        // Check if RLS might be the issue
        const hasRlsPolicies = Object.values(diagnostics.rls).some(
          (policies: any) => Array.isArray(policies) && policies.length > 0,
        )

        if (!hasRlsPolicies) {
          issues.push({
            type: "rls_missing",
            title: "Row Level Security Policies Missing",
            description: "The students table exists but has no RLS policies allowing access.",
            solution: "Add RLS policies to allow access to the students table.",
            script: rlsFixScript,
          })
        }

        // Check if permissions might be the issue
        issues.push({
          type: "permissions",
          title: "Permission Issues",
          description: "The students table exists but your application may not have permission to access it.",
          solution: "Grant the necessary permissions to the anon and authenticated roles.",
          script: grantPermissionsScript,
        })
      }
    }

    // If no specific issues found but still having problems
    if (issues.length === 0 && !Object.values(diagnostics.queries).some((query: any) => query.success)) {
      issues.push({
        type: "unknown",
        title: "Unknown Database Issue",
        description:
          "The students table appears to exist but cannot be accessed. This might be due to a connection issue or a complex permission problem.",
        solution: "Try recreating the table with proper permissions and RLS policies.",
        script: createTableScript,
      })
    }

    return issues
  }

  const issues = diagnostics ? determineIssues() : []

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Database Permission Diagnostics & Repair</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 text-gray-500 animate-spin" />
          <span className="ml-3 text-gray-600">Running diagnostics...</span>
        </div>
      ) : diagnostics ? (
        <div className="space-y-6">
          <div className="p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
            <div className="flex items-center">
              {diagnostics.connection ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700">Database connection successful</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">Database connection failed</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(diagnostics.environmentVariables).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-2 ${value ? "bg-green-500" : "bg-red-500"}`}></div>
                  <span className={value ? "text-green-700" : "text-red-700"}>
                    {key}: {value ? "Available" : "Missing"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-2">Schemas</h2>
            {diagnostics.schemas.length > 0 ? (
              <ul className="list-disc pl-5">
                {diagnostics.schemas.map((schema, index) => (
                  <li key={index}>{schema}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No custom schemas found</p>
            )}
          </div>

          <div className="p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-2">Students Table Status</h2>
            {Object.entries(diagnostics.tables).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(diagnostics.tables).map(([schema, tableInfo]: [string, any]) => (
                  <div key={schema} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-medium mb-2">Schema: {schema}</h3>
                    <div className="flex items-center mb-2">
                      {tableInfo.exists ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-700">Table exists</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          <span className="text-red-700">Table does not exist</span>
                        </>
                      )}
                    </div>

                    {tableInfo.exists && tableInfo.columns.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Columns:</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Column Name
                                </th>
                                <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Data Type
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {tableInfo.columns.map((column, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {column.column_name}
                                  </td>
                                  <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-500">
                                    {column.data_type}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Query results */}
                    {diagnostics.queries[schema] && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-1">Query Test:</h4>
                        <div className="flex items-center">
                          {diagnostics.queries[schema].success ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-green-700">Can query table successfully</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                              <span className="text-red-700">
                                Cannot query table: {diagnostics.queries[schema].error}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* RLS policies */}
                    {diagnostics.rls[schema] && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-1">RLS Policies:</h4>
                        {diagnostics.rls[schema].length > 0 ? (
                          <ul className="list-disc pl-5 text-sm">
                            {diagnostics.rls[schema].map((policy, index) => (
                              <li key={index}>
                                {policy.policyname} ({policy.cmd}) for {policy.roles || "all roles"}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-yellow-600">
                            <Shield className="h-4 w-4 inline mr-1" />
                            No RLS policies found. This might prevent access.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-500">No information about students table found in any schema</p>
            )}
          </div>

          {/* Service Role Test */}
          {diagnostics.permissions.serviceRole && (
            <div className="p-4 border rounded-md">
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <Key className="h-5 w-5 mr-2 text-gray-700" />
                Service Role Access
              </h2>
              <div className="flex items-center">
                {diagnostics.permissions.serviceRole.success ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700">Service role can access the students table</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700">
                      Service role cannot access the students table: {diagnostics.permissions.serviceRole.error}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Identified Issues */}
          {issues && issues.length > 0 && (
            <div className="p-4 border rounded-md bg-yellow-50">
              <h2 className="text-lg font-semibold mb-4">Identified Issues & Solutions</h2>

              <div className="space-y-6">
                {issues.map((issue, index) => (
                  <div key={index} className="p-4 bg-white border rounded-md">
                    <h3 className="font-medium text-lg mb-2">{issue.title}</h3>
                    <p className="mb-3 text-gray-700">{issue.description}</p>
                    <p className="mb-4 font-medium">Solution: {issue.solution}</p>

                    <div className="relative">
                      <div className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto text-sm font-mono">
                        <pre className="whitespace-pre-wrap">{issue.script}</pre>
                      </div>
                      <button
                        onClick={() => copyToClipboard(issue.script)}
                        className="absolute top-2 right-2 p-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copied ? <CheckCircle className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">To apply this fix:</p>
                      <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                        <li>
                          Go to your{" "}
                          <a
                            href="https://supabase.com/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center"
                          >
                            Supabase Dashboard <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </li>
                        <li>Select your project</li>
                        <li>
                          Go to the <strong>SQL Editor</strong> section
                        </li>
                        <li>Create a new query</li>
                        <li>Copy and paste the SQL script above</li>
                        <li>Run the query</li>
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={runDiagnostics}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                  Running...
                </>
              ) : (
                "Run Diagnostics Again"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">No diagnostic data available</div>
      )}

      <div className="mt-8 p-4 border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">After Fixing the Database</h2>
        <p className="mb-4">Once you've successfully fixed the database issues, follow these steps:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Return to the booking page</li>
          <li>Try the verification process again</li>
          <li>If you still encounter issues, check the browser console for detailed error messages</li>
        </ol>
      </div>
    </div>
  )
}

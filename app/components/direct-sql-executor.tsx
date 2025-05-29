"use client"

import { useState } from "react"
import { Loader2, CheckCircle, AlertCircle, Copy } from "lucide-react"

export default function DirectSqlExecutor() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const sqlScript = `-- Create extension if it doesn't exist
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
VALUES ('Test Student', 'test@example.com', '1234567890');`

  const executeSql = async () => {
    setIsExecuting(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/execute-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql: sqlScript }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.message || "Failed to execute SQL")
        if (data.error) {
          setError(`${data.message}: ${data.error}`)
        }
      }
    } catch (err) {
      setError("Error executing SQL: " + (err.message || "Unknown error"))
    } finally {
      setIsExecuting(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      },
      (err) => {
        console.error("Could not copy text: ", err)
      },
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Direct SQL Execution</h2>
      <p className="mb-4 text-gray-600">
        This will attempt to directly execute the SQL to create the students table. Use this if the other methods have
        failed.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-700">{result.message}</p>
              {result.verification && <p className="text-green-700 text-sm mt-1">{result.verification}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="relative mb-6">
        <div className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto text-sm font-mono">
          <pre className="whitespace-pre-wrap">{sqlScript}</pre>
        </div>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <CheckCircle className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={executeSql}
          disabled={isExecuting}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
        >
          {isExecuting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Executing...
            </>
          ) : (
            "Execute SQL"
          )}
        </button>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="font-medium text-yellow-800 mb-2">Important Note</h3>
        <p className="text-yellow-800 text-sm">
          If this method also fails, you will need to manually execute the SQL in the Supabase SQL Editor. Copy the SQL
          above and run it in your Supabase dashboard.
        </p>
      </div>
    </div>
  )
}

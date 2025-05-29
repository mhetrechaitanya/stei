"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function DatabaseSetup() {
  const [isCreating, setIsCreating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createQuotesTable = async () => {
    try {
      setIsCreating(true)
      setError(null)

      const response = await fetch("/api/setup-quotes-table", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create quotes table")
      }

      setIsSuccess(true)
    } catch (err: any) {
      console.error("Error creating quotes table:", err)
      setError(err.message || "An error occurred while creating the quotes table")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Database Setup</CardTitle>
        <CardDescription>Initialize the database tables required for the website</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Quotes Table</h3>
              <p className="text-sm text-gray-500">Required for the Inspiration Corner</p>
            </div>
            {isSuccess ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="h-5 w-5 mr-1" />
                <span>Created</span>
              </div>
            ) : error ? (
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-1" />
                <span>Error</span>
              </div>
            ) : null}
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">{error}</div>}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={createQuotesTable} disabled={isCreating || isSuccess} className="w-full">
          {isCreating ? "Creating..." : isSuccess ? "Table Created" : "Create Quotes Table"}
        </Button>
      </CardFooter>
    </Card>
  )
}

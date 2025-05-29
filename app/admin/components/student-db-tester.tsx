"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle, Database, RefreshCw, ArrowRight, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function StudentDbTester() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<{
    success?: boolean
    message?: string
    error?: string
    data?: any
  } | null>(null)
  const [setupLoading, setSetupLoading] = useState(false)
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null)

  const testConnection = async () => {
    try {
      setIsLoading(true)
      setTestResult(null)

      const response = await fetch("/api/test-student-db")
      const data = await response.json()

      setTestResult(data)

      if (data.success) {
        toast({
          title: "Success",
          description: data.message || "Student database connection successful",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to connect to student database",
          variant: "destructive",
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message || "An unexpected error occurred",
      })

      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const setupStudentsTable = async () => {
    try {
      setSetupLoading(true)

      const response = await fetch("/api/setup-students-table")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message || "Students table set up successfully",
        })

        // Test the connection after setup
        await testConnection()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to set up students table",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setSetupLoading(false)
    }
  }

  const runDiagnostics = async () => {
    try {
      setIsLoading(true)
      setDiagnosticInfo(null)

      const response = await fetch("/api/db-diagnostics")
      const data = await response.json()

      setDiagnosticInfo(data)

      if (data.success) {
        toast({
          title: "Diagnostics Complete",
          description: "Database diagnostics completed successfully",
        })
      } else {
        toast({
          title: "Diagnostics Failed",
          description: data.error || "Failed to run database diagnostics",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Student Database Connection
        </CardTitle>
        <CardDescription>Test and fix the connection to the students table in your Supabase database</CardDescription>
      </CardHeader>
      <CardContent>
        {testResult && (
          <div className={`p-4 rounded-md ${testResult.success ? "bg-green-50" : "bg-red-50"} mb-4`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {testResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${testResult.success ? "text-green-800" : "text-red-800"}`}>
                  {testResult.success ? "Connection Successful" : "Connection Failed"}
                </h3>
                <div className={`mt-2 text-sm ${testResult.success ? "text-green-700" : "text-red-700"}`}>
                  <p>{testResult.success ? testResult.message : testResult.error}</p>

                  {!testResult.success && (
                    <div className="mt-3">
                      <Button
                        onClick={setupStudentsTable}
                        disabled={setupLoading}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {setupLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                            Setting up...
                          </>
                        ) : (
                          <>
                            Fix Database Table <ArrowRight className="ml-2 h-3 w-3" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {diagnosticInfo && (
          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="diagnostics">
              <AccordionTrigger className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Database Diagnostics
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-3 bg-gray-50 rounded-md text-sm font-mono overflow-x-auto">
                  <pre>{JSON.stringify(diagnosticInfo, null, 2)}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
      <CardFooter className="flex gap-4 flex-wrap">
        <Button onClick={testConnection} disabled={isLoading} className="bg-[#D40F14] hover:bg-[#B00D11]">
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Connection"
          )}
        </Button>

        <Button onClick={setupStudentsTable} disabled={setupLoading} variant="outline">
          {setupLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Setting up...
            </>
          ) : (
            "Setup Students Table"
          )}
        </Button>

        <Button onClick={runDiagnostics} disabled={isLoading} variant="outline">
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            "Run Diagnostics"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

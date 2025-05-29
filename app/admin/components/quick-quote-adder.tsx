"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Check } from "lucide-react"

export default function QuickQuoteAdder() {
  const [quote, setQuote] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!quote || !author) {
      setError("Quote and author are required")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quote,
          author,
          category: category || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to add quote: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setQuote("")
        setAuthor("")
        setCategory("")
      } else {
        throw new Error(data.message || "Failed to add quote")
      }
    } catch (err) {
      console.error("Error adding quote:", err)
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add Inspirational Quote</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quote">Quote</Label>
            <Textarea
              id="quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Enter an inspirational quote"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter the author's name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="E.g., Motivation, Success, Leadership"
            />
          </div>

          {error && (
            <div className="bg-red-50 p-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 p-3 rounded-md flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <p className="text-sm text-green-700">Quote added successfully!</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Quote"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

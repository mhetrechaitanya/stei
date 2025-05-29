"use client"

import type React from "react"

import { useState } from "react"
import { createQuote } from "@/app/actions/quotes-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function AddQuotePage() {
  const [formData, setFormData] = useState({
    quote: "",
    author: "",
    category: "",
    color: "#f8f9fa",
    is_featured: false,
  })
  const [status, setStatus] = useState<{ success?: boolean; message?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_featured: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({})

    try {
      const result = await createQuote(formData)

      if (result.success) {
        setStatus({ success: true, message: "Quote added successfully!" })
        setFormData({
          quote: "",
          author: "",
          category: "",
          color: "#f8f9fa",
          is_featured: false,
        })
      } else {
        setStatus({ success: false, message: result.message || "Failed to add quote" })
      }
    } catch (error) {
      setStatus({ success: false, message: "An error occurred" })
      console.error("Error adding quote:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Quote</h1>

      {status.message && (
        <div
          className={`p-4 mb-6 rounded-md ${status.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="quote">Quote</Label>
          <Textarea
            id="quote"
            name="quote"
            value={formData.quote}
            onChange={handleChange}
            required
            className="w-full"
            placeholder="Enter the quote text"
          />
        </div>

        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            placeholder="Enter the author's name"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="E.g., Motivation, Success, Leadership"
          />
        </div>

        <div>
          <Label htmlFor="color">Background Color</Label>
          <div className="flex items-center gap-2">
            <Input
              id="color"
              name="color"
              type="color"
              value={formData.color}
              onChange={handleChange}
              className="w-16 h-10"
            />
            <span className="text-sm text-gray-500">{formData.color}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="is_featured" checked={formData.is_featured} onCheckedChange={handleCheckboxChange} />
          <Label htmlFor="is_featured" className="cursor-pointer">
            Feature this quote
          </Label>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Adding..." : "Add Quote"}
        </Button>
      </form>

      <div className="mt-6">
        <a href="/admin/quotes" className="text-blue-500 hover:underline">
          ← Back to Quotes Manager
        </a>
      </div>
    </div>
  )
}

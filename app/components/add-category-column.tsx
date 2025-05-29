"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function AddCategoryColumn() {
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const addCategoryColumn = async () => {
    setIsAdding(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/db/add-category-column", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || "Category column added successfully!")
      } else {
        setError(data.error || "Failed to add category column")
      }
    } catch (err) {
      setError("An error occurred while adding the category column")
      console.error(err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Workshop Categories</h3>
      <p className="text-sm text-gray-600 mb-4">
        Add a category column to the workshops table to enable category filtering.
      </p>

      <Button onClick={addCategoryColumn} disabled={isAdding} className="bg-[#D40F14] hover:bg-[#B00D11] text-white">
        {isAdding ? "Adding..." : "Add Category Column"}
      </Button>

      {message && <div className="mt-3 p-2 bg-green-50 text-green-700 rounded text-sm">{message}</div>}

      {error && <div className="mt-3 p-2 bg-red-50 text-red-700 rounded text-sm">{error}</div>}
    </div>
  )
}

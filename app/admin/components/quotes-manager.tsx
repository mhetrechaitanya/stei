"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus, Save, X, Edit, Check, RefreshCw } from "lucide-react"
import type { Quote } from "@/lib/quotes-service"
import { getAllQuotes, createQuote, updateQuote, deleteQuote } from "@/app/actions/quotes-actions"
import { TABLES } from "@/lib/supabase-config"

interface NewQuote {
  text: string
  author: string
  category: string
}

export default function QuotesManager() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newQuote, setNewQuote] = useState<NewQuote>({ text: "", author: "", category: "" })
  const [isAdding, setIsAdding] = useState(false)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch quotes
  const fetchQuotes = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getAllQuotes()

      if (result.success) {
        console.log("Quotes fetched successfully:", result.data)
        setQuotes(result.data || [])
      } else {
        console.error("Failed to load quotes:", result.error)
        setError(result.error || "Failed to load quotes")
      }
    } catch (error: any) {
      console.error("Error fetching quotes:", error.message)
      setError("Failed to load quotes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  // Add new quote
  const handleAddQuote = async () => {
    if (!newQuote.text || !newQuote.author) {
      setError("Quote text and author are required")
      return
    }

    try {
      const result = await createQuote(newQuote)

      if (result.success) {
        setQuotes([...quotes, result.data])
        setNewQuote({ text: "", author: "", category: "" })
        setIsAdding(false)
        showSuccess("Quote added successfully")
      } else {
        setError(result.error || "Failed to add quote")
      }
    } catch (error: any) {
      console.error("Error adding quote:", error.message)
      setError("Failed to add quote")
    }
  }

  // Start editing a quote
  const handleStartEdit = (quote: Quote) => {
    setEditingQuote(quote)
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingQuote(null)
  }

  // Update quote
  const handleUpdateQuote = async () => {
    if (!editingQuote) return

    try {
      const result = await updateQuote(editingQuote)

      if (result.success) {
        setQuotes(quotes.map((q) => (q.id === editingQuote.id ? result.data : q)))
        setEditingQuote(null)
        showSuccess("Quote updated successfully")
      } else {
        setError(result.error || "Failed to update quote")
      }
    } catch (error: any) {
      console.error("Error updating quote:", error.message)
      setError("Failed to update quote")
    }
  }

  // Delete quote
  const handleDeleteQuote = async (id: number) => {
    if (!confirm("Are you sure you want to delete this quote?")) return

    try {
      const result = await deleteQuote(id)

      if (result.success) {
        setQuotes(quotes.filter((quote) => quote.id !== id))
        showSuccess("Quote deleted successfully")
      } else {
        setError(result.error || "Failed to delete quote")
      }
    } catch (error: any) {
      console.error("Error deleting quote:", error.message)
      setError("Failed to delete quote")
    }
  }

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Manage Inspiration Quotes</h2>
          <p className="text-sm text-gray-500">Table: {TABLES.QUOTES}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchQuotes}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
            disabled={isAdding}
          >
            <Plus size={16} /> Add New Quote
          </button>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Add new quote form */}
      {isAdding && (
        <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-3">Add New Quote</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quote Text <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newQuote.text}
                onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                rows={3}
                placeholder="Enter the quote text"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newQuote.author}
                onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                placeholder="Enter the author's name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={newQuote.category}
                onChange={(e) => setNewQuote({ ...newQuote, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                placeholder="Enter a category (e.g., motivation, success)"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewQuote({ text: "", author: "", category: "" })
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddQuote}
                className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} /> Save Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quotes list */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quotes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No quotes found. Add your first quote!
                </td>
              </tr>
            ) : (
              quotes.map((quote) => (
                <tr key={quote.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {editingQuote?.id === quote.id ? (
                      <textarea
                        value={editingQuote.text}
                        onChange={(e) => setEditingQuote({ ...editingQuote, text: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                        rows={2}
                      />
                    ) : (
                      <div className="max-w-xs truncate" title={quote.text}>
                        "{quote.text}"
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingQuote?.id === quote.id ? (
                      <input
                        type="text"
                        value={editingQuote.author}
                        onChange={(e) => setEditingQuote({ ...editingQuote, author: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                      />
                    ) : (
                      quote.author
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingQuote?.id === quote.id ? (
                      <input
                        type="text"
                        value={editingQuote.category || ""}
                        onChange={(e) => setEditingQuote({ ...editingQuote, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                      />
                    ) : (
                      quote.category || "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {editingQuote?.id === quote.id ? (
                        <>
                          <button
                            onClick={handleUpdateQuote}
                            className="text-green-600 hover:text-green-900"
                            title="Save changes"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                            title="Cancel editing"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(quote)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit quote"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuote(quote.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete quote"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

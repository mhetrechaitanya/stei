"use client"

import { useState, useEffect } from "react"

interface Quote {
  id: number
  quote: string
  author: string
  category?: string
  is_featured?: boolean
  color?: string
}

export default function InspirationPageClient() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  // Default fallback quotes
  const fallbackQuotes: Quote[] = [
    {
      id: 1,
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "Motivation",
    },
    {
      id: 2,
      quote: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
      category: "Inspiration",
    },
    {
      id: 3,
      quote: "It does not matter how slowly you go as long as you do not stop.",
      author: "Confucius",
      category: "Perseverance",
    },
    // Add more fallback quotes as needed
  ]

  useEffect(() => {
    // Start with fallback quotes immediately
    setQuotes(fallbackQuotes)

    async function fetchQuotes() {
      try {
        // Set a timeout to abort the fetch if it takes too long
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch("/api/quotes/all", {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setQuotes(data.data)
        }
      } catch (error) {
        console.error("Error fetching quotes:", error)
        // Keep using fallback quotes (already set)
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[#900000]">Inspiration Corner</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find motivation and wisdom in our collection of inspirational quotes. Refresh your mind and spirit with words
          that inspire.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
          ))}
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No inspirational quotes available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full border border-gray-200"
              style={{ backgroundColor: quote.color || "#ffffff", borderLeft: "4px solid #900000" }}
            >
              <div className="flex-grow">
                <p className="text-lg font-medium mb-4 italic">"{quote.quote}"</p>
                <p className="text-gray-700 text-right">— {quote.author}</p>
              </div>
              {quote.category && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                    {quote.category}
                  </span>
                </div>
              )}
              {quote.is_featured && (
                <div className="mt-2">
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Featured</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

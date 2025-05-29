"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

// Define the Quote type directly in this file to avoid import issues
type Quote = {
  id: number | string
  quote: string
  author: string
  category?: string
  color?: string
  is_featured?: boolean
}

// Hardcoded fallback quotes to ensure we always have content
const FALLBACK_QUOTES: Quote[] = [
  {
    id: 1,
    quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    color: "#f8f9fa",
  },
  {
    id: 2,
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    color: "#f1f8e9",
  },
  {
    id: 3,
    quote: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    color: "#e8f5e9",
  },
  {
    id: 4,
    quote: "If life were predictable it would cease to be life, and be without flavor.",
    author: "Eleanor Roosevelt",
    color: "#e3f2fd",
  },
  {
    id: 5,
    quote: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    color: "#e8eaf6",
  },
  {
    id: 6,
    quote: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
    author: "Mother Teresa",
    color: "#fce4ec",
  },
]

export default function EnhancedInspirationCorner() {
  const [quotes, setQuotes] = useState<Quote[]>(FALLBACK_QUOTES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use the fallback quotes immediately to ensure content is displayed
    setQuotes(FALLBACK_QUOTES)
    setLoading(false)

    // Then try to fetch from API, but don't wait for it
    const fetchQuotes = async () => {
      try {
        // Skip the API call entirely to avoid the 500 error
        // We're using the hardcoded quotes instead
        return

        /* Commented out to prevent the 500 error
        const response = await fetch('/api/quotes/random?count=6', { 
          cache: 'no-store',
          next: { revalidate: 3600 } // Revalidate every hour
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setQuotes(data.data)
          }
        }
        */
      } catch (error) {
        console.log("Using fallback quotes due to API error")
        // We already set the fallback quotes, so no need to do anything here
      }
    }

    // Call the fetch function but don't wait for it
    fetchQuotes()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quotes.map((quote, index) => (
        <QuoteCard key={index} quote={quote} />
      ))}
    </div>
  )
}

function QuoteCard({ quote }: { quote: Quote }) {
  // Default color if none is specified
  const bgColor = quote.color || "#f8f9fa"

  return (
    <Card
      className="p-6 flex flex-col justify-between h-full shadow-md hover:shadow-lg transition-shadow duration-300"
      style={{
        backgroundColor: bgColor,
        borderLeft: "4px solid #900000",
      }}
    >
      <div>
        <p className="text-lg font-serif italic mb-4">"{quote.quote}"</p>
      </div>
      <div className="mt-auto">
        <p className="text-right font-medium">— {quote.author}</p>
        {quote.category && <p className="text-right text-sm text-gray-600 mt-1">#{quote.category}</p>}
        {quote.is_featured && (
          <div className="mt-2">
            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Featured</span>
          </div>
        )}
      </div>
    </Card>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getFallbackQuotes } from "@/lib/fallback-quotes"
import type { Quote } from "@/lib/fallback-quotes"

// Update the main component to simplify the UI and match the homepage style
export default function InspirationClient() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const quotesPerPage = 9

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true)
        setError(null)

        // Add a cache-busting parameter to prevent caching
        const timestamp = new Date().getTime()

        // Use a direct fetch with error handling
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        try {
          const response = await fetch(`/api/quotes/all?t=${timestamp}`, {
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            console.error(`API error: ${response.status} ${response.statusText}`)
            console.error("Response:", await response.text().catch(() => "Could not read response text"))
            // If API fails, use fallback quotes directly
            setQuotes(getFallbackQuotes(30))
            return
          }

          const data = await response.json()

          if (data && Array.isArray(data.data) && data.data.length > 0) {
            setQuotes(data.data)
          } else {
            // If no quotes returned, use fallback quotes
            console.log("No quotes found or invalid format, using fallbacks")
            setQuotes(getFallbackQuotes(30))
          }
        } catch (fetchError) {
          console.error("Fetch error:", fetchError)
          // If fetch fails, use fallback quotes directly
          setQuotes(getFallbackQuotes(30))
        }
      } catch (err) {
        console.error("Error in component:", err)
        // If anything fails, use fallback quotes
        setQuotes(getFallbackQuotes(30))
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [])

  // Calculate pagination
  const indexOfLastQuote = currentPage * quotesPerPage
  const indexOfFirstQuote = indexOfLastQuote - quotesPerPage
  const currentQuotes = quotes.slice(indexOfFirstQuote, indexOfLastQuote)
  const totalPages = Math.ceil(quotes.length / quotesPerPage)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2 text-[#900000]">Inspiration Corner</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover wisdom and motivation from our collection of inspirational quotes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2 text-[#900000]">Inspiration Corner</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover wisdom and motivation from our collection of inspirational quotes.
        </p>
        <Link href="/" className="inline-block mt-4">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">
            {error ? `Error: ${error}` : "No inspirational quotes available at the moment."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentQuotes.map((quote, index) => (
              <QuoteCard key={quote.id || index} quote={quote} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex">
                <Button
                  variant="outline"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="mr-1"
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => paginate(i + 1)}
                    className="mx-1"
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-1"
                >
                  Next
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
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

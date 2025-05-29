import { NextResponse } from "next/server"

// Define the Quote type
type Quote = {
  id: number | string
  quote: string
  author: string
  category?: string
  color?: string
  is_featured?: boolean
}

// Hardcoded fallback quotes
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
  {
    id: 7,
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    color: "#fff3e0",
  },
  {
    id: 8,
    quote: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    color: "#f3e5f5",
  },
  {
    id: 9,
    quote: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    author: "Ralph Waldo Emerson",
    color: "#e0f7fa",
  },
  {
    id: 10,
    quote: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi",
    color: "#f9fbe7",
  },
]

// Function to get random quotes
function getRandomQuotes(count: number): Quote[] {
  // Shuffle the array and take the first 'count' elements
  return [...FALLBACK_QUOTES].sort(() => 0.5 - Math.random()).slice(0, Math.min(count, FALLBACK_QUOTES.length))
}

export async function GET(request: Request) {
  try {
    // Get the count parameter from the URL, default to 6
    const url = new URL(request.url)
    const countParam = url.searchParams.get("count")
    const count = countParam ? Number.parseInt(countParam, 10) : 6

    // Return random quotes from our hardcoded array
    const quotes = getRandomQuotes(count)

    return NextResponse.json({
      success: true,
      data: quotes,
      message: "Quotes retrieved successfully",
    })
  } catch (error) {
    console.error("Error in /api/quotes/random:", error)

    // Even if there's an error, return some fallback quotes
    return NextResponse.json({
      success: true,
      data: getRandomQuotes(6),
      message: "Error occurred, using fallback quotes",
    })
  }
}

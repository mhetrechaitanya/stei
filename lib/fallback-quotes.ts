export type Quote = {
  id: number
  quote: string
  author: string
  category?: string
  color?: string
  is_featured?: boolean
}

const fallbackQuotes: Quote[] = [
  {
    id: 1,
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Motivation",
    color: "#f8f9fa",
  },
  {
    id: 2,
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "Inspiration",
    color: "#f8f9fa",
  },
  {
    id: 3,
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "Perseverance",
    color: "#f8f9fa",
  },
  {
    id: 4,
    quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Success",
    color: "#f8f9fa",
  },
  {
    id: 5,
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "Dreams",
    color: "#f8f9fa",
  },
  {
    id: 6,
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    category: "Future",
    color: "#f8f9fa",
  },
  {
    id: 7,
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "Perseverance",
    color: "#f8f9fa",
  },
  {
    id: 8,
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "Doubt",
    color: "#f8f9fa",
  },
  {
    id: 9,
    quote: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "Life",
    color: "#f8f9fa",
  },
  {
    id: 10,
    quote: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    category: "Risk",
    color: "#f8f9fa",
  },
  {
    id: 11,
    quote: "Whether you think you can or you think you can't, you're right.",
    author: "Henry Ford",
    category: "Mindset",
    color: "#f8f9fa",
  },
  {
    id: 12,
    quote: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    category: "Journey",
    color: "#f8f9fa",
  },
  {
    id: 13,
    quote: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "Mindset",
    color: "#f8f9fa",
  },
  {
    id: 14,
    quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "Action",
    color: "#f8f9fa",
  },
  {
    id: 15,
    quote: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "Life",
    color: "#f8f9fa",
  },
  {
    id: 16,
    quote: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    category: "Purpose",
    color: "#f8f9fa",
  },
  {
    id: 17,
    quote: "Get busy living or get busy dying.",
    author: "Stephen King",
    category: "Life",
    color: "#f8f9fa",
  },
  {
    id: 18,
    quote: "You only live once, but if you do it right, once is enough.",
    author: "Mae West",
    category: "Life",
    color: "#f8f9fa",
  },
  {
    id: 19,
    quote: "Many of life's failures are people who did not realize how close they were to success when they gave up.",
    author: "Thomas A. Edison",
    category: "Failure",
    color: "#f8f9fa",
  },
  {
    id: 20,
    quote: "If you want to live a happy life, tie it to a goal, not to people or things.",
    author: "Albert Einstein",
    category: "Happiness",
    color: "#f8f9fa",
  },
  {
    id: 21,
    quote: "Never let the fear of striking out keep you from playing the game.",
    author: "Babe Ruth",
    category: "Fear",
    color: "#f8f9fa",
  },
  {
    id: 22,
    quote: "Money and success don't change people; they merely amplify what is already there.",
    author: "Will Smith",
    category: "Success",
    color: "#f8f9fa",
  },
  {
    id: 23,
    quote: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "Life",
    color: "#f8f9fa",
  },
  {
    id: 24,
    quote: "Not how long, but how well you have lived is the main thing.",
    author: "Seneca",
    category: "Life",
    color: "#f8f9fa",
  },
  {
    id: 25,
    quote: "If life were predictable it would cease to be life, and be without flavor.",
    author: "Eleanor Roosevelt",
    category: "Life",
    color: "#f8f9fa",
  },
  {
    id: 26,
    quote: "The whole secret of a successful life is to find out what is one's destiny to do, and then do it.",
    author: "Henry Ford",
    category: "Success",
    color: "#f8f9fa",
  },
  {
    id: 27,
    quote: "In order to write about life first you must live it.",
    author: "Ernest Hemingway",
    category: "Life",
    color: "#f8f9fa",
  },
  {
    id: 28,
    quote: "The big lesson in life, baby, is never be scared of anyone or anything.",
    author: "Frank Sinatra",
    category: "Fear",
    color: "#f8f9fa",
  },
  {
    id: 29,
    quote: "Life is either a daring adventure or nothing at all.",
    author: "Helen Keller",
    category: "Adventure",
    color: "#f8f9fa",
  },
  {
    id: 30,
    quote: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    category: "Happiness",
    color: "#f8f9fa",
  },
]

export function getFallbackQuotes(count = 6): Quote[] {
  // If count is greater than the available quotes, return all quotes
  if (count >= fallbackQuotes.length) {
    return [...fallbackQuotes]
  }

  // Otherwise, return a random selection of quotes
  const shuffled = [...fallbackQuotes].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

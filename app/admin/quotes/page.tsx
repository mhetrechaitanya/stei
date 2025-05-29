import { Suspense } from "react"
import QuotesManager from "../components/quotes-manager"
import Link from "next/link"

export default function QuotesAdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Quotes Management</h1>

      <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Database Setup</h2>
        <p className="text-gray-600 mb-4">
          If you're seeing errors about the quotes table not existing, visit the homepage first to set up the database.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
        >
          Go to Homepage
        </Link>
      </div>

      <Suspense fallback={<div>Loading quotes manager...</div>}>
        <QuotesManager />
      </Suspense>
    </div>
  )
}

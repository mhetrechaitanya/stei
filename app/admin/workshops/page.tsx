import { Suspense } from "react"
import WorkshopManager from "../components/workshop-manager"
import Link from "next/link"

export default function WorkshopsAdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Workshops Management</h1>

      <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
        <p className="text-gray-600 mb-4">Manage your workshops, categories, and other settings from this dashboard.</p>
        <div className="flex gap-2">
          <Link
            href="/admin/quotes"
            className="inline-block px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            Manage Quotes
          </Link>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>

      <Suspense fallback={<div>Loading workshop manager...</div>}>
        <WorkshopManager />
      </Suspense>
    </div>
  )
}

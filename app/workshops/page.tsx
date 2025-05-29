import { Suspense } from "react"
import { getActiveWorkshopCategories, getWorkshops } from "@/lib/workshop-service"
import ClientWorkshopList from "@/app/components/client-workshop-list"
import { OurWorkshopsHeading } from "@/app/components/our-workshops-heading"
import Link from "next/link"

// Server-side configuration
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function WorkshopsPage() {
  // Server-side data fetching
  const { data: workshops = [], error, fallback } = await getWorkshops()
  const { data: categories = [] } = await getActiveWorkshopCategories()

  const hasError = !!error
  const isFallback = fallback

  return (
    <div className="container mx-auto px-4 py-8">
      <OurWorkshopsHeading />

      {hasError && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-semibold text-amber-800 mb-2">Workshop Data Unavailable</h3>
          <p className="text-amber-700 mb-4">
            We're having trouble loading the workshops. This could be due to a database connection issue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/admin/workshop-troubleshoot"
              className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              Troubleshoot Workshops
            </Link>
            {/* Remove client-side reload button */}
          </div>
        </div>
      )}

      {isFallback && !hasError && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Using Sample Workshop Data</h3>
          <p className="text-blue-700 mb-4">
            We're currently displaying sample workshop data. This could be because the workshops table is empty or not
            properly set up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/admin/workshop-troubleshoot"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Setup Workshops
            </Link>
          </div>
        </div>
      )}

      {!hasError && (
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          }
        >
          {/* Pass data to client component */}
          <ClientWorkshopList initialWorkshops={workshops} categories={categories} />
        </Suspense>
      )}
    </div>
  )
}

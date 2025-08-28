"use client"

import { Suspense, useEffect, useState } from "react"
import { getActiveWorkshopCategories, getWorkshops } from "@/lib/workshop-service"
import ClientWorkshopList from "@/app/components/client-workshop-list"
import { OurWorkshopsHeading } from "@/app/components/our-workshops-heading"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function WorkshopsPage() {
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')
  const [workshops, setWorkshops] = useState([])
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [fallback, setFallback] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const workshopsResult = await getWorkshops()
        const categoriesResult = await getActiveWorkshopCategories()
        
        setWorkshops(workshopsResult.data || [])
        setCategories(categoriesResult.data || [])
        setError(workshopsResult.error)
        setFallback(workshopsResult.fallback)
      } catch (err) {
        setError(err.message || "Failed to fetch data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter workshops if free filter is applied
  const filteredWorkshops = filter === 'free' 
    ? workshops.filter(workshop => workshop.fee === 0)
    : workshops

  const hasError = !!error
  const isFallback = fallback

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <OurWorkshopsHeading />
        <div className="flex justify-center items-center py-12">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OurWorkshopsHeading />

      {/* Show filter indicator if free workshops are being displayed */}
      {filter === 'free' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Showing free workshops only</span>
            </div>
            <Link
              href="/workshops"
              className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              View All Workshops
            </Link>
          </div>
        </div>
      )}

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
          {/* Pass filtered data to client component */}
          <ClientWorkshopList initialWorkshops={filteredWorkshops} categories={categories} />
        </Suspense>
      )}
    </div>
  )
}

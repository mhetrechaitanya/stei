"use client"

import { useState, useEffect, useCallback } from "react"
import type { Workshop } from "@/lib/types"
import EnhancedWorkshopCard from "./enhanced-workshop-card"
import CategoryCardFilter from "./category-card-filter"

interface ClientWorkshopListProps {
  initialWorkshops: Workshop[]
  categories: string[]
}

export default function ClientWorkshopList({ initialWorkshops = [], categories = [] }: ClientWorkshopListProps) {
  const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops)
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>(initialWorkshops)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentCategory, setCurrentCategory] = useState("all")
  // Use a string format instead of Date to avoid hydration errors
  const [lastRefreshed, setLastRefreshed] = useState<string>("")
  
  // Set the initial lastRefreshed value after hydration
  useEffect(() => {
    setLastRefreshed(new Date().toLocaleTimeString())
  }, [])

  // Function to refresh workshop data
  const refreshWorkshops = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/workshops", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })


      
      

      if (response.ok) {
        const data = await response.json()
        console.log("client workshop list : ", data);
        if (Array.isArray(data)) {
          setWorkshops(data)

          // Apply current category filter to new data
          if (currentCategory === "all") {
            setFilteredWorkshops(data)
          } else {
            const filtered = data.filter((workshop) => workshop.category_id === currentCategory)
            setFilteredWorkshops(filtered)
          }
          setLastRefreshed(new Date().toLocaleTimeString())
        } else {
          setError("Invalid response format")
        }
      } else {
        setError(`Failed to refresh workshops: ${response.status} ${response.statusText}`)
      }
    } catch (err) {
      setError("Error refreshing workshops: " + (err.message || "Unknown error"))
      console.error("Error refreshing workshops:", err)
    } finally {
      setIsLoading(false)
    }
  }, [currentCategory])

  // Periodically refresh data (every 30 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshWorkshops()
    }, 30000) // 30 seconds

    return () => clearInterval(intervalId)
  }, [refreshWorkshops])

  // Filter workshops by category
  const handleCategoryChange = (category: string) => {
    setIsLoading(true)
    setCurrentCategory(category)

    try {
      if (category === "all") {
        setFilteredWorkshops(workshops)
      } else {
        const filtered = workshops.filter((workshop) => workshop.category_id === category)
        setFilteredWorkshops(filtered)
      }
    } catch (err) {
      setError("Error filtering workshops: " + (err.message || "Unknown error"))
      console.error("Error filtering workshops:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // If there are no workshops, show a message
  if (workshops.length === 0 && !isLoading && !error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No Workshops Available</h3>
        <p className="text-gray-600 mb-6">Check back soon for upcoming workshops!</p>
        <button
          onClick={refreshWorkshops}
          className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Refresh Workshops
        </button>
      </div>
    )
  }

  // If there are workshops but filtered results are empty, show a different message
  if (workshops.length > 0 && filteredWorkshops.length === 0 && !isLoading && !error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No Workshops Found</h3>
        <p className="text-gray-600 mb-6">
          {currentCategory === "all" 
            ? "No workshops match your current filter criteria." 
            : `No workshops found in the "${currentCategory}" category.`
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleCategoryChange("all")}
            className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-red-700 transition-colors"
          >
            View All Workshops
          </button>
          <button
            onClick={refreshWorkshops}
            className="px-4 py-2 border border-[#D40F14] text-[#D40F14] rounded-md hover:bg-[#D40F14] hover:text-white transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    )
  }

  // Filter categories to only show those with workshops
  const activeCategories = categories.filter(
    (cat) => typeof cat === 'string' && cat.toLowerCase() === "all" || workshops.some((workshop) => workshop.category_id === cat)
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {/* Category Filter */}
        <CategoryCardFilter categories={activeCategories} onCategoryChange={handleCategoryChange} />

        {/* Add refresh button */}
        <button
          onClick={refreshWorkshops}
          disabled={isLoading}
          className="text-sm flex items-center gap-1 text-gray-600 hover:text-[#D40F14] disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isLoading ? "animate-spin" : ""}
          >
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
            <path d="M3 22v-6h6"></path>
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
          </svg>
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error loading workshops</p>
          <p className="text-sm">{error}</p>
          <button onClick={refreshWorkshops} className="mt-2 text-sm underline hover:no-underline">
            Try again
          </button>
        </div>
      )}
   {/* Last Refreshed - Only show if it's been set (client-side only) */}
      {lastRefreshed && (
        <div className="text-xs text-gray-500 mb-4">Last updated: {lastRefreshed}</div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D40F14] border-r-transparent"></div>
        </div>
      )}

      {/* Workshops Grid */}
      <div className="px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkshops.map((workshop) => (
            <EnhancedWorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>
      </div>

      {/* No Results Message */}
      {!isLoading && filteredWorkshops.length === 0 && workshops.length > 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No Workshops Found</h3>
          <p className="text-gray-600">
            {currentCategory === "all" 
              ? "No workshops match your current filter criteria." 
              : `No workshops found in the "${currentCategory}" category.`
            }
          </p>
          <div className="mt-4">
            <button
              onClick={() => handleCategoryChange("all")}
              className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-red-700 transition-colors"
            >
              View All Workshops
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
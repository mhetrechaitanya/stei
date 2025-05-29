"use client"

import { useState, useEffect, useCallback } from "react"
import WorkshopCard from "./workshop-card"
import WorkshopCategoryFilter from "./workshop-category-filter"
import type { Workshop } from "@/lib/types"

interface RealTimeWorkshopListProps {
  initialWorkshops: Workshop[]
  categories?: string[]
}

export default function RealTimeWorkshopList({ initialWorkshops = [], categories = [] }: RealTimeWorkshopListProps) {
  const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops)
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>(initialWorkshops)
  const [currentCategory, setCurrentCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  // Function to refresh workshop data
  const refreshWorkshops = useCallback(async () => {
    try {
      const response = await fetch("/api/workshops", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setWorkshops(data)

          // Apply current category filter to new data
          if (currentCategory === "all") {
            setFilteredWorkshops(data)
          } else {
            const filtered = data.filter((workshop) => workshop.category === currentCategory)
            setFilteredWorkshops(filtered)
          }
        }
      }

      setLastRefreshed(new Date())
    } catch (error) {
      console.error("Error refreshing workshops:", error)
    }
  }, [currentCategory])

  // Periodically refresh data (every 30 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshWorkshops()
    }, 30000) // 30 seconds

    return () => clearInterval(intervalId)
  }, [refreshWorkshops])

  // Filter workshops when category changes
  useEffect(() => {
    if (currentCategory === "all") {
      setFilteredWorkshops(workshops)
    } else {
      // If the category column doesn't exist yet, this will just show all workshops
      const filtered = workshops.filter((workshop) => workshop.category === currentCategory)
      setFilteredWorkshops(filtered)
    }
  }, [currentCategory, workshops])

  // Handle category change
  const handleCategoryChange = async (category: string) => {
    setIsLoading(true)
    setCurrentCategory(category)

    try {
      if (category === "all") {
        // No need to fetch if we're showing all workshops
        setFilteredWorkshops(workshops)
      } else {
        // Try to fetch workshops by category
        const response = await fetch(`/api/workshops/category/${category}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.workshops && Array.isArray(data.workshops)) {
            setFilteredWorkshops(data.workshops)
          }
        } else {
          // If there's an error (like the category column doesn't exist),
          // just filter the existing workshops client-side
          const filtered = workshops.filter((workshop) => workshop.category === category)
          setFilteredWorkshops(filtered)
        }
      }
    } catch (error) {
      console.error("Error fetching workshops by category:", error)
      // Fallback to client-side filtering
      const filtered = workshops.filter((workshop) => workshop.category === category)
      setFilteredWorkshops(filtered)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {/* Only show the category filter if we have categories */}
        {categories && categories.length > 0 && (
          <WorkshopCategoryFilter
            categories={categories}
            onCategoryChange={handleCategoryChange}
            currentCategory={currentCategory}
          />
        )}

        {/* Add refresh button */}
        <button
          onClick={() => {
            setIsLoading(true)
            refreshWorkshops().finally(() => setIsLoading(false))
          }}
          className="text-sm flex items-center gap-1 text-gray-600 hover:text-[#D40F14]"
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
          >
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
            <path d="M3 22v-6h6"></path>
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
          </svg>
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D40F14]"></div>
        </div>
      ) : filteredWorkshops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkshops.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No workshops found</h3>
          <p className="text-gray-500">
            {currentCategory === "all"
              ? "There are no workshops available at the moment."
              : `There are no workshops in the "${currentCategory}" category.`}
          </p>
        </div>
      )}
    </div>
  )
}

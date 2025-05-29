"use client"

import { useState } from "react"

interface WorkshopCategoryFilterProps {
  categories: string[]
  onCategoryChange: (category: string) => void
}

export default function WorkshopCategoryFilter({ categories = [], onCategoryChange }: WorkshopCategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // If no categories are available, don't render the filter
  if (!categories || categories.length === 0) {
    return null
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    onCategoryChange(category)
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Browse by Category</h3>

      <div className="flex flex-wrap gap-3">
        {/* "All" category is always available */}
        <button
          onClick={() => handleCategoryChange("all")}
          className={`px-5 py-2.5 rounded-full transition-all duration-300 ${
            activeCategory === "all"
              ? "bg-[#D40F14] text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          All Workshops
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-5 py-2.5 rounded-full transition-all duration-300 ${
              activeCategory === category
                ? "bg-[#D40F14] text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

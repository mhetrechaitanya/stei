"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { StyledCategoryLabel } from "./styled-category-label"

interface CategoryCardFilterProps {
  categories: string[]
}

export default function CategoryCardFilter({ categories = ["All"] }: CategoryCardFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "All"
  const [selectedCategory, setSelectedCategory] = useState(currentCategory)

  // Ensure we always have at least the "All" category
  const displayCategories = categories.length > 0 ? categories : ["All"]

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)

    if (category === "All") {
      router.push("/workshops")
    } else {
      router.push(`/workshops?category=${encodeURIComponent(category)}`)
    }
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4">Filter by Category</h2>
      <div className="flex flex-wrap gap-3">
        {displayCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedCategory === category ? "bg-[#D40F14] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <StyledCategoryLabel category={category} />
          </button>
        ))}
      </div>
    </div>
  )
}

// Also export as named for backward compatibility
export { CategoryCardFilter }

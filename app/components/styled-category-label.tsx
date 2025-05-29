interface StyledCategoryLabelProps {
  category: string
  className?: string
}

export function StyledCategoryLabel({ category, className = "" }: StyledCategoryLabelProps) {
  // Handle special styling for each category
  if (category === "iACE Series") {
    return (
      <span className={`font-medium ${className}`}>
        i<span className="text-[#900000]">ACE</span> Series
      </span>
    )
  } else if (category === "Self-growth") {
    return <span className={`font-medium text-[#900000] ${className}`}>Self-growth</span>
  } else if (category === "The Strength of She") {
    return (
      <span className={`font-medium ${className}`}>
        The Strength of <span className="text-[#900000]">She</span>
      </span>
    )
  }

  // Default styling for other categories
  return <span className={`font-medium ${className}`}>{category}</span>
}

// Also export as default for backward compatibility
export default StyledCategoryLabel

interface OurWorkshopsHeadingProps {
  className?: string
  color?: string
  size?: "sm" | "md" | "lg" | "xl"
  centered?: boolean
  withUnderline?: boolean
}

export function OurWorkshopsHeading({
  className = "",
  color = "#900000",
  size = "lg",
  centered = true,
  withUnderline = false,
}: OurWorkshopsHeadingProps) {
  // Size classes mapping
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  }

  // Alignment classes
  const alignmentClass = centered ? "text-center" : ""

  return (
    <div className={`mb-8 ${alignmentClass} ${className}`}>
      <h2 className={`font-bold ${sizeClasses[size]} relative inline-block`} style={{ color }}>
        Our Workshops
        {withUnderline && (
          <span
            className="absolute bottom-0 left-0 w-full h-1 rounded-full"
            style={{ backgroundColor: color, bottom: "-8px" }}
          ></span>
        )}
      </h2>
      {withUnderline && <div className="h-4"></div>}
    </div>
  )
}

// Also export as default for backward compatibility
export default OurWorkshopsHeading

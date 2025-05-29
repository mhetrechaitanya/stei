import type React from "react"

interface LowercaseSteiProps {
  className?: string
}

const LowercaseStei: React.FC<LowercaseSteiProps> = ({ className = "" }) => {
  return (
    <span className={`lowercase ${className}`} style={{ textTransform: "lowercase" }}>
      stei
    </span>
  )
}

export default LowercaseStei

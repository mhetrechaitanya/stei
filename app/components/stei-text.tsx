const SteiText = ({ className = "" }: { className?: string }) => {
  return (
    <span
      className={`stei-text font-serif flex items-baseline inline-flex ${className}`}
      style={{ textTransform: "lowercase" }}
    >
      <span className="text-black" style={{ textTransform: "lowercase" }}>
        s
      </span>
      <span className="text-black text-[1.2em] leading-none" style={{ textTransform: "lowercase" }}>
        t
      </span>
      <span className="text-black" style={{ textTransform: "lowercase" }}>
        e
      </span>
      <span className="text-[#900000]" style={{ textTransform: "lowercase" }}>
        i
      </span>
    </span>
  )
}

export default SteiText

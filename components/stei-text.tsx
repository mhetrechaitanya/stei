interface SteiTextProps {
  className?: string
}

export default function SteiText({ className = "" }: SteiTextProps) {
  return (
    <span className={`font-serif inline-flex items-baseline ${className}`}>
      <span className="text-black">s</span>
      <span className="text-black text-[1.1em] leading-none">t</span>
      <span className="text-black">e</span>
      <span className="text-[#900000]">i</span>
    </span>
  )
}

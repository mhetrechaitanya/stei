interface IACETextProps {
  className?: string
  fontSize?: string
}

export default function IACEText({ className = "", fontSize = "inherit" }: IACETextProps) {
  return (
    <span className={`font-bold ${className}`} style={{ fontSize }}>
      i<span className="text-[#900000]">ACE</span>
    </span>
  )
}

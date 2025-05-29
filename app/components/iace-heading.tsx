interface IACEHeadingProps {
  title?: string
  className?: string
  color?: string
}

export default function IACEHeading({ title = "Series", className = "", color = "#900000" }: IACEHeadingProps) {
  return (
    <span className={`font-bold ${className}`}>
      i<span style={{ color }}>{`ACE`}</span>
      {title ? ` ${title}` : ""}
    </span>
  )
}

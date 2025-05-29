import IACEText from "./iace-text"

interface StyledAnnouncementBadgeProps {
  className?: string
}

export default function StyledAnnouncementBadge({ className = "" }: StyledAnnouncementBadgeProps) {
  return (
    <span className={`bg-black px-3 py-2 rounded-full text-white font-semibold inline-block ${className}`}>
      stei launches its <IACEText /> Series Workshops
    </span>
  )
}

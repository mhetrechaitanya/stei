import type React from "react"
import IACEText from "@/app/components/iace-text"

export function formatIACEText(text: string): React.ReactNode[] {
  if (!text) return [text]

  const parts = text.split(/(iACE)/g)

  return parts.map((part, index) => {
    if (part === "iACE") {
      return <IACEText key={index} />
    }
    return part
  })
}

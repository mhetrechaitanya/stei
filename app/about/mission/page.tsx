import type { Metadata } from "next"
import MissionClientPage from "./MissionClientPage"

export const metadata: Metadata = {
  title: "Our Mission | STEI - Accessibility and Empowerment",
  description:
    "STEI's mission to provide accessible learning and empower individuals through transformative education.",
}

export default function MissionPage() {
  return <MissionClientPage />
}

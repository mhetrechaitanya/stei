import type { Metadata } from "next"
import InspirationClient from "./client"

export const metadata: Metadata = {
  title: "Inspiration Corner | STEI",
  description: "Find motivation and wisdom in our collection of inspirational quotes at STEI.",
}

export default function InspirationPage() {
  return <InspirationClient />
}

import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inspiration Corner | STEI",
  description: "Find motivation and wisdom in our collection of inspirational quotes at STEI.",
}

export default function InspirationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="min-h-screen bg-white">{children}</main>
}

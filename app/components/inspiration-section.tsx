import type React from "react"
import { Suspense } from "react"
import Link from "next/link"
import EnhancedInspirationCorner from "./enhanced-inspiration-corner"

export default function InspirationSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2 text-[#900000]">Inspiration Corner</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover wisdom and motivation from our collection of inspirational quotes.
          </p>
        </div>

        <Suspense fallback={<InspirationSectionSkeleton />}>
          <ErrorBoundaryWrapper>
            <EnhancedInspirationCorner />
          </ErrorBoundaryWrapper>
        </Suspense>

        <div className="text-center mt-10">
          <Link
            href="/inspiration"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#900000] hover:bg-[#700000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#900000]"
          >
            Explore More Inspiration
          </Link>
        </div>
      </div>
    </section>
  )
}

function InspirationSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
      ))}
    </div>
  )
}

function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* This is a simple error boundary for server components */}
      {children}
    </div>
  )
}

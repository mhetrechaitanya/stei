import { getWorkshopById } from "@/lib/workshop-service"
import BatchSelectionClient from "./batch-selection-client"
import { Suspense } from "react"

export default async function SelectBatchPage({ params }) {
  const { id } = params
  const { data: workshop, error } = await getWorkshopById(id)

  // Enable debug mode based on query parameter or environment
  const isDebugMode = process.env.NODE_ENV === "development"

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Workshop</h2>
          <p className="text-red-600">{error.message || "Failed to load workshop details"}</p>
        </div>
      </div>
    )
  }

  if (!workshop) {
    return (
      <div className="container mx-auto p-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">Workshop Not Found</h2>
          <p className="text-yellow-600">The requested workshop could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <Suspense fallback={<div className="p-6 text-center">Loading batch selection...</div>}>
        <BatchSelectionClient workshop={workshop} isDebug={isDebugMode} />
      </Suspense>
    </div>
  )
}

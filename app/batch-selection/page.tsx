import BatchSelectionDemo from "@/app/components/batch-selection-demo"

export default function BatchSelectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Workshop Batch Selection</h1>
        <BatchSelectionDemo />
      </div>
    </div>
  )
}

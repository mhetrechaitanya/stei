import FreeWebinarsSection from "@/components/free-webinars-section"

export default function FreeWebinarsDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Free Webinars Section Demo
        </h1>
        <FreeWebinarsSection />
      </div>
    </div>
  )
}

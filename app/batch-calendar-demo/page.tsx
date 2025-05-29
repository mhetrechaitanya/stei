import WorkshopBatchSelectorDemo from "../components/workshop-batch-selector-demo"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function BatchCalendarDemoPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <WorkshopBatchSelectorDemo />
        </div>
      </div>
      <Footer />
    </>
  )
}

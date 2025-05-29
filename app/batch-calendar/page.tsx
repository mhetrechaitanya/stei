import BatchCalendarDemo from "@/app/components/batch-calendar-demo"

export default function BatchCalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Workshop Batch Calendar</h1>
        <BatchCalendarDemo />
      </div>
    </div>
  )
}

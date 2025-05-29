// Add the missing page component to handle verification and redirect

import { Suspense } from "react"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getWorkshopById } from "@/lib/workshop-service"
import WorkshopBookingClient from "./workshop-booking-client"

export default async function WorkshopBookingPage({ params }) {
  const { id } = params

  if (!id) {
    notFound()
  }

  const { data: workshop, error } = await getWorkshopById(id)

  if (error || !workshop) {
    notFound()
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <WorkshopBookingClient workshop={workshop} workshopId={id} />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

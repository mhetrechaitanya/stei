"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface BookingClientProps {
  workshopId?: string
  batchId?: string
  workshopTitle?: string
  workshopPrice?: number
}

export default function BookingClient({
  workshopId = "",
  batchId = "",
  workshopTitle = "Workshop",
  workshopPrice = 4999,
}: BookingClientProps) {
  const router = useRouter()
  const [workshop, setWorkshop] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Set default workshop data
  const defaultWorkshopData = {
    id: workshopId || "1",
    title: workshopTitle || "Workshop",
    price: workshopPrice || 4999,
    description: "Workshop description",
    image: "/placeholder.svg?height=400&width=800",
    sessions: 4,
    duration: "2 hours per session",
    capacity: 15,
    upcoming: [],
  }

  useEffect(() => {
    // Function to fetch workshop data
    const fetchWorkshop = async () => {
      // If no workshopId is provided or it's an empty string, use default data
      if (!workshopId || workshopId.trim() === "") {
        console.log("No workshop ID provided, using default data")
        setWorkshop(defaultWorkshopData)
        return
      }

      setLoading(true)
      try {
        console.log(`Fetching workshop with ID: ${workshopId}`)
        const response = await fetch(`/api/workshops/${workshopId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Workshop data fetched successfully:", data)
        setWorkshop(data)
      } catch (err: any) {
        console.error("Error fetching workshop:", err)
        setError(err.message)
        // Set default workshop data even if there's an error
        setWorkshop(defaultWorkshopData)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshop()
  }, [workshopId, workshopTitle, workshopPrice])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement form submission logic here
    console.log("Form submitted")
  }

  // Handle existing user button click
  useEffect(() => {
    const handleExistingUserClick = () => {
      router.push("/booking/registered")
    }

    const existingUserButton = document.querySelector('[data-action="existing-user"]')
    if (existingUserButton) {
      existingUserButton.addEventListener("click", handleExistingUserClick)
    }

    return () => {
      if (existingUserButton) {
        existingUserButton.removeEventListener("click", handleExistingUserClick)
      }
    }
  }, [router])

  // Handle form submission
  useEffect(() => {
    const form = document.getElementById("bookingForm")
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault()
        router.push(`/booking/payment-pending?workshopId=${workshopId}&batchId=${batchId}`)
      })
    }

    return () => {
      if (form) {
        form.removeEventListener("submit", (e) => {
          e.preventDefault()
          router.push(`/booking/payment-pending?workshopId=${workshopId}&batchId=${batchId}`)
        })
      }
    }
  }, [router, workshopId, batchId])

  return null
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Clock, Users } from "lucide-react"

interface WorkshopSelectorProps {
  workshops: any[]
  onSelect: (workshop: any) => void
}

export default function WorkshopSelector({ workshops, onSelect }: WorkshopSelectorProps) {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null)

  const handleWorkshopSelect = (workshopId: string) => {
    setSelectedWorkshopId(workshopId)
  }

  const handleContinue = () => {
    if (selectedWorkshopId) {
      const selectedWorkshop = workshops.find((w) => w.id === selectedWorkshopId)
      if (selectedWorkshop) {
        onSelect(selectedWorkshop)
      }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Select a Workshop</h2>

      <div className="mb-6">
        <p className="text-gray-700 mb-4">Please select a workshop from the options below:</p>

        <div className="grid grid-cols-1 gap-4">
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedWorkshopId === workshop.id
                  ? "border-[#D40F14] bg-[#FFF5F5] shadow-md"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
              onClick={() => handleWorkshopSelect(workshop.id)}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/4 relative h-40 md:h-auto">
                  <Image
                    src={workshop.image || "/placeholder.svg?height=200&width=200"}
                    alt={workshop.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="md:w-3/4">
                  <h3 className="font-bold text-lg mb-2">{workshop.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{workshop.description}</p>

                  <div className="flex flex-wrap gap-4 mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-[#D40F14] mr-2" />
                      <span className="text-sm">{workshop.sessions} Sessions</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-[#D40F14] mr-2" />
                      <span className="text-sm">{workshop.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-[#D40F14] mr-2" />
                      <span className="text-sm">{workshop.capacity} participants</span>
                    </div>
                  </div>

                  <div className="font-bold text-[#D40F14]">₹{workshop.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleContinue}
          className="px-6 py-2 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11] transition-colors"
          disabled={!selectedWorkshopId}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

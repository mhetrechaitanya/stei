"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Clock, Users, Search } from "lucide-react"

interface WorkshopSelectorProps {
  workshops: any[]
  onSelect: (workshop: any) => void
}

export default function WorkshopSelector({ workshops, onSelect }: WorkshopSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter workshops based on search term
  const filteredWorkshops = workshops.filter(
    (workshop) =>
      workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Select a Workshop</h2>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-[#D40F14] focus:border-[#D40F14]"
          placeholder="Search workshops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Workshops Grid */}
      {filteredWorkshops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.map((workshop) => (
            <div
              key={workshop.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelect(workshop)}
            >
              <div className="relative h-40">
                <Image
                  src={workshop.image || "/placeholder.svg?height=160&width=320"}
                  alt={workshop.title}
                  fill
                  className="object-cover"
                />
                {workshop.featured && (
                  <div className="absolute top-0 left-0 bg-[#D40F14] text-white px-2 py-1 text-xs rounded-br-lg">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{workshop.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{workshop.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-[#D40F14] mr-1" />
                    <span>{workshop.sessions} Sessions</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-[#D40F14] mr-1" />
                    <span>{workshop.duration}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 text-[#D40F14] mr-1" />
                    <span>Max {workshop.capacity}</span>
                  </div>
                  <span className="font-bold text-[#D40F14]">₹{workshop.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No workshops found matching your search.</p>
          <p className="text-sm text-gray-400 mt-2">Try different keywords or browse all workshops.</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  )
}

"use client"

import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function SelfGrowthWorkshop() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <Image src="/placeholder.svg?height=200&width=400" alt="Self-growth Workshop" fill className="object-cover" />
        <div className="absolute top-4 left-4 bg-[#D40F14] text-white px-3 py-1 rounded-md font-bold z-10">Popular</div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">Self-growth</h3>
        <p className="text-gray-600 mb-4">
          Self-growth workshops are curated for those who aspire to evolve, build resilience, and strengthen their drive
          for success.
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          <span className="text-sm font-medium bg-[#FFF5F5] text-[#D40F14] px-3 py-1 rounded-full">8 Sessions</span>
          <span className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">₹4,999</span>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Key Benefits:</h4>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Develop emotional resilience and mindfulness</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Build confidence and overcome limiting beliefs</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Master goal-setting and personal achievement</span>
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Next Batch:</h4>
          <div className="bg-gray-50 p-2 rounded-md text-sm">
            <div className="font-medium">June 15, 2025</div>
            <div className="text-gray-600">6:00 PM - 8:00 PM</div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Users } from "lucide-react";
import StyledCategoryLabel from "./styled-category-label";

interface EnhancedWorkshopCardProps {
  workshop: any;
}

export default function EnhancedWorkshopCard({
  workshop,
}: EnhancedWorkshopCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={workshop.image || "/placeholder.svg?height=200&width=400"}
          alt={workshop.title || "Workshop preview image"}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="mb-4">
          <StyledCategoryLabel
            category={workshop.category}
            className="text-[#D40F14] mb-2"
          />
          <h3 className="text-xl font-bold mb-2 text-gray-800">
            {workshop.title}
          </h3>
          {/* Render HTML description safely */}
          {workshop.description ? (
            <div
              className="text-gray-600 mb-4 line-clamp-2 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: workshop.description }}
            />
          ) : (
            <p className="text-gray-600 mb-4 line-clamp-2">
              No description available.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <span className="text-sm font-medium bg-[#FFF5F5] text-[#D40F14] px-3 py-1 rounded-full">
            {workshop.sessions} Sessions
          </span>
          <span className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            {Number(workshop.fee) === 0 ? "Free" : `₹${workshop.fee}`}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-[#D40F14] mr-2" />
            <span className="text-sm">{workshop.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-[#D40F14] mr-2" />
            <span className="text-sm">
              Max {workshop.capacity} participants
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          {/* <Link
            href={`/workshops/${workshop.id}`}
            className="text-[#D40F14] font-medium hover:underline"
          >
            Learn More
          </Link> */}

          <Link
            href={`/booking/landing?workshopId=${workshop.id}`}
            className="bg-[#D40F14] hover:bg-[#B00D11] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book Slot
          </Link>
        </div>
      </div>
    </div>
  );
}

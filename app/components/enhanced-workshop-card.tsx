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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <div className="relative h-48">
        <Image
          src={workshop.image || "/placeholder.svg?height=200&width=300"}
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
              className="text-gray-600 mb-4 prose prose-sm max-w-none line-clamp-4"
              dangerouslySetInnerHTML={{ __html: workshop.description }}
            />
          ) : (
            <p className="text-gray-600 mb-4">
              No description available.
            </p>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <Link
            // href={`/workshops/${workshop.id}`}
            href={`/booking/landing?workshopId=${workshop.id}`}
            className="bg-[#D40F14] hover:bg-[#B00D11] text-white px-6 py-2 rounded-md text-base font-medium transition-colors flex items-center justify-center"
          >
            Workshop Details
          </Link>
        </div>
      </div>
    </div>
  );
}

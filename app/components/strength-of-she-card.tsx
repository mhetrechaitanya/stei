import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function StrengthOfSheCard() {
  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-1/2 relative h-[300px] lg:h-auto">
            <Image
              src="/images/strength-of-she.webp"
              alt="The Strength of She Workshop"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#D40F14]/30 to-transparent mix-blend-overlay"></div>
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-white bg-[#D40F14] rounded-full">
              Women's Empowerment
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">The Strength of She</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              An interactive, reflective workshop for women who carry it all—yet are often unseen. Step in. Claim your
              power. Discover resilience, and strengthen their drive for success.
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-[#D40F14]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                1-Day Intensive
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-[#D40F14]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                For Professional Women
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-[#D40F14] hover:bg-[#B00D11] text-white">Register Now</Button>
              <Link href="/workshops/strength-of-she">
                <Button variant="outline" className="border-[#D40F14] text-[#D40F14] hover:bg-[#FFF5F5]">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

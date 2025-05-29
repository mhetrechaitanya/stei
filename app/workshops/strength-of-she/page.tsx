import StrengthOfSheCard from "@/app/components/strength-of-she-card"
import StrengthOfSheFeatures from "@/components/strength-of-she-features"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Strength of She Workshop | STEI",
  description:
    "An interactive, reflective workshop for women who carry it all—yet are often unseen. Step in. Claim your power. Discover resilience, and strengthen their drive for success.",
}

export default function StrengthOfShePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="py-12 md:py-20">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">The Strength of She</h1>
          <div className="h-1 w-24 bg-[#D40F14] mx-auto mb-12"></div>

          <StrengthOfSheCard />

          <div className="max-w-4xl mx-auto px-4 my-16">
            <h2 className="text-3xl font-bold mb-6 text-center">About This Workshop</h2>
            <p className="text-lg text-gray-700 mb-6">
              The Strength of She is a transformative workshop designed specifically for women in professional
              environments who often find themselves carrying multiple responsibilities yet feeling unseen or
              undervalued.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Through guided exercises, reflective practices, and collaborative discussions, participants will uncover
              their innate strengths, address limiting beliefs, and develop practical strategies to navigate workplace
              challenges with confidence and authenticity.
            </p>
            <p className="text-lg text-gray-700">
              This workshop creates a safe, supportive space for women to connect, share experiences, and build a
              network of like-minded professionals who understand their unique journey.
            </p>
          </div>

          <StrengthOfSheFeatures />
        </div>
      </div>
    </main>
  )
}

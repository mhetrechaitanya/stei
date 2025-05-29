import StrengthOfSheCard from "./strength-of-she-card"

export default function EnhancedWorkshopsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Workshops</h2>
          <div className="h-1 w-24 bg-[#D40F14] mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our transformative workshops designed to empower and elevate your personal and professional journey
          </p>
        </div>

        <StrengthOfSheCard />

        {/* Other workshop cards can be added here */}
      </div>
    </section>
  )
}

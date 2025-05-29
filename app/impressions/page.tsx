import SalmanTestimonialCard from "../components/salman-testimonial-card"
import ShahzannTestimonialCard from "../components/shahzann-testimonial-card"
import VrindaTestimonialCard from "../components/vrinda-testimonial-card"

export default function ImpressionsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Personal Experiences</h1>
          <div className="w-32 h-1 bg-[#D40F14] mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Hear from individuals who have transformed their lives through their experience with our mentors
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SalmanTestimonialCard />
          <ShahzannTestimonialCard />
          <VrindaTestimonialCard />
        </div>
      </div>
    </div>
  )
}

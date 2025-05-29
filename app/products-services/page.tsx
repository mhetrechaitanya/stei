import Link from "next/link"
import { ArrowRight } from "lucide-react"
import IACEText from "@/app/components/iace-text"

export default function ProductsServicesPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Products & Services</h1>

        {/* Category 1 - Personalised Coaching */}
        <section className="mb-16">
          <div className="bg-red-600 text-white py-4 px-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold">Personalised Coaching</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Individualised Support</h3>
              <p className="text-gray-700 mb-4">Get personalised guidance for self-discovery and empowerment.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Coaching for Success</h3>
              <p className="text-gray-700 mb-4">Cultivate confidence and enhance personal impact.</p>
            </div>
          </div>
        </section>

        {/* Category 2 - Interactive Workshops */}
        <section className="mb-16">
          <div className="bg-red-600 text-white py-4 px-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold">Interactive Workshops</h2>
          </div>

          {/* Sub Category – iACE Series */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 border-b pb-2">
              <IACEText /> Series
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold mb-3">
                  <IACEText /> Interviews
                </h4>
                <p className="text-gray-700 mb-4">Flagship Workshop</p>
                <Link
                  href="/workshops"
                  className="inline-flex items-center text-red-600 hover:text-red-800 font-medium"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold mb-3">
                  <IACEText /> Conversational Fluency
                </h4>
                <p className="text-gray-700 mb-4">Enhance your communication skills</p>
                <Link
                  href="/workshops"
                  className="inline-flex items-center text-red-600 hover:text-red-800 font-medium"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold mb-3">
                  <IACEText /> Individual Impact
                </h4>
                <p className="text-gray-700 mb-4">Make a lasting impression</p>
                <Link
                  href="/workshops"
                  className="inline-flex items-center text-red-600 hover:text-red-800 font-medium"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sub Category – Self-Growth Workshops */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 border-b pb-2">Self-Growth Workshops</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold mb-3">Chaos to Calm</h4>
                <p className="text-gray-700 mb-4">Find your center in a chaotic world</p>
                <Link
                  href="/workshops"
                  className="inline-flex items-center text-red-600 hover:text-red-800 font-medium"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold mb-3">Critical Thinking</h4>
                <p className="text-gray-700 mb-4">Develop analytical problem-solving skills</p>
                <Link
                  href="/workshops"
                  className="inline-flex items-center text-red-600 hover:text-red-800 font-medium"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold mb-3">Listening Skills</h4>
                <p className="text-gray-700 mb-4">Master the art of active listening</p>
                <Link
                  href="/workshops"
                  className="inline-flex items-center text-red-600 hover:text-red-800 font-medium"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold mb-3">Self in Sync</h4>
                <p className="text-gray-700 mb-4">Align your actions with your authentic self</p>
                <Link
                  href="/workshops"
                  className="inline-flex items-center text-red-600 hover:text-red-800 font-medium"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sub Category – The Strength of SHE */}
        <section className="mb-16">
          <div className="bg-red-600 text-white py-4 px-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold">The Strength of SHE</h2>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <h3 className="text-2xl font-semibold mb-4">You rise. You lead. You excel.</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Empowering women to discover their unique strengths and leverage them for personal and professional
              growth.
            </p>
            <Link href="/workshops" className="inline-flex items-center text-red-600 hover:text-red-800 font-medium">
              Discover more <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

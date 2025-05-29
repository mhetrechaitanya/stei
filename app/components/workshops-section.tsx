import IACEText from "./iace-text"

export default function WorkshopsSection() {
  return (
    <div className="mt-24 py-16 px-6 rounded-xl bg-[#FFF5F5] border border-[#FFCDD2]">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Our Workshops</h2>
        <div className="h-1 w-24 bg-[#D40F14] mx-auto mb-6"></div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore our range of interactive workshops designed to enhance your skills and boost your confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Card 1 - iACE Series */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="relative h-48">
            <img
              alt="STEI iACE Interviews Workshop Session"
              loading="lazy"
              decoding="async"
              className="object-cover"
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Interview-mvBLBc80AiuspNNDwl3KTe0RtDZXtw.jpeg"
              style={{ position: "absolute", height: "100%", width: "100%", inset: 0, color: "transparent" }}
            />
            <div className="absolute top-0 left-0 bg-[#D40F14] text-white px-3 py-1 rounded-br-lg font-bold">
              Flagship
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              <IACEText /> Series
            </h3>
            <p className="text-gray-600">
              <IACEText /> series is designed to help you ace interviews, improve conversational fluency, and create a
              lasting impact, transforming confidence into empowerment.
            </p>
          </div>
        </div>

        {/* Card 2 - Self-growth */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="relative h-48">
            <img
              alt="Self-growth Workshop"
              loading="lazy"
              decoding="async"
              className="object-cover"
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Conversational%20Fluency-xodQf2Uw9RDYUi1uxyoiQYYZmarvoi.jpeg"
              style={{ position: "absolute", height: "100%", width: "100%", inset: 0, color: "transparent" }}
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              <span className="text-[#900000]">Self-growth</span>
            </h3>
            <p className="text-gray-600">
              Self-growth workshops are curated for those who aspire to evolve, build resilience, and strengthen their
              drive for success.
            </p>
          </div>
        </div>

        {/* Card 3 - The Strength of She */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="relative h-48">
            <img
              alt="The Strength of She Workshop"
              loading="lazy"
              decoding="async"
              className="object-cover"
              src="/images/strength-of-she-new.png"
              style={{ position: "absolute", height: "100%", width: "100%", inset: 0, color: "transparent" }}
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              The Strength of <span className="text-[#900000]">She</span>
            </h3>
            <p className="text-gray-600">
              An interactive, reflective workshop for women who carry it all—yet are often unseen. Step in. Claim your
              power. Discover resilience, and strengthen their drive for success.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

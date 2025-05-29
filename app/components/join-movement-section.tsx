<section ref={sectionRef} className="py-16 bg-[#FFF8F8]">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      {/* Replace the old heading with the JoinSTEIMovement component */}
      <JoinSteiMovement />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Community Card */}
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <div className="h-48 overflow-hidden">
          <Image
            src="/images/community.png"
            alt="Community"
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Community</h3>
          <p className="text-gray-600">stei is a community dedicated to enablement and empowerment</p>
        </div>
      </div>

      {/* Personal Growth Card */}
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <div className="h-48 overflow-hidden">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Personal Growth"
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Personal Growth</h3>
          <p className="text-gray-600">Embark on a transformative journey with us.</p>
        </div>
      </div>

      {/* Empowerment Card */}
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <div className="h-48 overflow-hidden">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Empowerment"
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Empowerment</h3>
          <p className="text-gray-600">Identify and reach your full potential.</p>
        </div>
      </div>
    </div>
  </div>
</section>

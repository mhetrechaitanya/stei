import AnnouncementBanner from "../components/announcement-banner"

export default function AnnouncementDemo() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <h1 className="text-2xl font-bold text-center">Announcement Demo</h1>

        {/* The announcement banner with styled iACE */}
        <AnnouncementBanner />

        {/* Additional examples with different font sizes */}
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-bold">Additional Examples:</h2>

          <div className="p-4 border rounded-lg">
            <p className="text-sm">
              Small text: STEI launches its{" "}
              <span className="font-bold">
                i<span className="text-[#900000]">ACE</span>
              </span>{" "}
              Series Workshops
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <p className="text-base">
              Regular text: STEI launches its{" "}
              <span className="font-bold">
                i<span className="text-[#900000]">ACE</span>
              </span>{" "}
              Series Workshops
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <p className="text-lg">
              Large text: STEI launches its{" "}
              <span className="font-bold">
                i<span className="text-[#900000]">ACE</span>
              </span>{" "}
              Series Workshops
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-2xl">
              Heading: STEI launches its{" "}
              <span className="font-bold">
                i<span className="text-[#900000]">ACE</span>
              </span>{" "}
              Series Workshops
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

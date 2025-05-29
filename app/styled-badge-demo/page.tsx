import StyledAnnouncementBadge from "../components/styled-announcement-badge"

export default function StyledBadgeDemo() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-2xl font-bold">Styled Announcement Badge Demo</h1>

      <div className="flex flex-col gap-6 items-center">
        <StyledAnnouncementBadge />

        <div className="mt-8">
          <h2 className="text-xl mb-4">Usage in different contexts:</h2>
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <p className="mb-2">On white background:</p>
            <StyledAnnouncementBadge />
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-4">
            <p className="mb-2">On light gray background:</p>
            <StyledAnnouncementBadge />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
            <p className="mb-2">On dark background:</p>
            <StyledAnnouncementBadge />
          </div>
        </div>
      </div>
    </div>
  )
}

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getWorkshops } from "@/lib/data-service";
// Import the error boundary wrapper
import ErrorBoundaryWrapper from "@/app/components/error-boundary-wrapper";

// Import the new client component
import ClientWrapper from "./client-wrapper";

export function WorkshopDetails({ workshop }) {
  if (!workshop) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-700">Workshop details are not available.</p>
      </div>
    );
  }

  // console.log("in page.tsx ", workshop);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">About Workshop</h3>
      <p className="text-gray-600 mb-6">
        {workshop.description || "No description available."}
      </p>

      {/* About Mentor */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-3">About Mentor</h3>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden relative">
            {workshop.mentor?.image ? (
              <Image
                src="/placeholder.svg?height=100&width=100"
                alt={workshop.mentor?.name || "Mentor"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>
          <div>
            <p className="font-medium">
              {workshop.mentor?.name || "Expert Mentor"}
            </p>
            <p className="text-gray-500">
              {workshop.mentor?.title || "Industry Professional"}
            </p>
          </div>
        </div>
        <p className="mt-3 text-gray-600">
          {workshop.mentor?.bio ||
            "Our expert mentor brings years of industry experience to help you master new skills."}
        </p>
      </div>

      {/* Batch Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Available Batches</h3>
        {workshop.batches && workshop.batches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workshop.batches.map((batch, index) => {
              console.log(batch); // Log each batch object
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <p className="font-medium">{batch.batch_name}</p>
                  <p className="text-gray-600">
                    {batch.start_date || "Date TBD"},{" "}
                    {batch.start_time || "Time TBD"}
                  </p>
                  <p className="text-sm mt-2">
                    <span className="text-[#D40F14] font-medium">
                      {typeof batch.slots === "number" &&
                      typeof batch.enrolled === "number"
                        ? batch.slots - batch.enrolled
                        : "Limited"}
                    </span>{" "}
                    slots left
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No batches available at the moment.</p>
        )}
      </div>

      {/* Testimonials */}
      {workshop.testimonials && workshop.testimonials.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3">
            Feedback from Previous Participants
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#D40F14]">
            <p className="italic mb-2">{workshop.testimonials[0].text}</p>
            <p className="font-medium">{workshop.testimonials[0].name}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function BookingLandingPage({
  searchParams,
}: {
  searchParams: { workshopId?: string; batchId?: string };
}) {
  const workshopId = searchParams?.workshopId || "1";
  const batchId = searchParams?.batchId || "1";

  // Fetch workshop data with error handling
  let workshops = [];
  let error = null;

  try {
    const result = await getWorkshops();
    workshops = result.data || [];
    error = result.error;
  } catch (err) {
    console.error("Error fetching workshops:", err);
    error = "Failed to fetch workshop data";
  }

  // Handle errors
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Unable to load workshop data
          </h2>
          <p className="text-gray-600 mb-6">
            We're experiencing technical difficulties. Please try again later.
          </p>
          <Link
            href="/workshops"
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-red-700"
          >
            Return to Workshops
          </Link>
        </div>
      </div>
    );
  }

  // Handle case where no workshops are found
  if (!workshops || workshops.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">No Workshops Available</h2>
          <p className="text-gray-600 mb-6">
            There are currently no workshops available for registration.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-red-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Find the selected workshop or use the first one
  const selectedWorkshop =
    workshops.find((w) => w.id.toString() === workshopId.toString()) ||
    workshops[0];

  // Ensure we have a valid workshop
  if (!selectedWorkshop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Workshop Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested workshop could not be found.
          </p>
          <Link
            href="/workshops"
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-red-700"
          >
            Browse Workshops
          </Link>
        </div>
      </div>
    );
  }

  // Sanitize the workshop data for security
  const sanitizedWorkshop = {
    id: selectedWorkshop.id,
    title: selectedWorkshop.title || "Workshop",
    description: selectedWorkshop.description || "No description available",
    price:
      typeof selectedWorkshop.fee === "number" ? selectedWorkshop.fee : 0,
    image: "/placeholder.svg?height=400&width=600",
    batches: Array.isArray(selectedWorkshop.batches)
      ? selectedWorkshop.batches
      : [],
    mentor: selectedWorkshop.mentor || {
      name: "Expert Mentor",
      title: "Industry Professional",
    },
    testimonials: Array.isArray(selectedWorkshop.testimonials)
      ? selectedWorkshop.testimonials
      : [],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[200px]">
        <Image
          src="/placeholder.svg?height=400&width=600"
          alt="Workshop Registration"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <Link
              href="/workshops"
              className="inline-flex items-center text-white/80 hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Workshops
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Register for {sanitizedWorkshop.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-8">
              Workshop Registration
            </h2>

            {/* Workshop Info - Wrapped in ErrorBoundary */}
            <ErrorBoundaryWrapper>
              <WorkshopDetails workshop={sanitizedWorkshop} />
            </ErrorBoundaryWrapper>

            <div className="grid md:grid-cols-2 gap-8">
              {/* New Registration */}
              <div className="bg-blue-50 rounded-lg p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">New Registration</h3>
                <p className="mb-6 text-gray-600">
                  If you're new to our platform, register here to book a
                  workshop
                </p>
                <Link
                  href={`/student-registration`}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
                >
                  Register Now
                </Link>
              </div>

              {/* Already Registered */}
              <div className="bg-red-50 rounded-lg p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#D40F14] rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Already Registered</h3>
                <p className="mb-6 text-gray-600">
                  If you've already registered with us, use this option to book
                  a workshop slot
                </p>
                <button
                  className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-3 px-4 rounded-md transition-colors"
                  id="continue-to-payment-btn"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client-side only booking flow */}
      <ClientWrapper workshop={sanitizedWorkshop} />
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton"

export default function WorkshopsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section Skeleton */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16">
          <div className="relative h-[300px] md:h-[400px]">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        {/* Introduction Skeleton */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
          <div className="h-1 w-24 bg-gray-200 mx-auto mb-6"></div>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6 mx-auto" />
        </div>

        {/* Featured Workshop Skeleton */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative">
              <div className="relative h-[300px] md:h-full">
                <Skeleton className="h-full w-full" />
              </div>
            </div>
            <div className="md:w-1/2 p-6 md:p-8">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>

              <Skeleton className="h-6 w-1/3 mb-2" />
              <div className="mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start mb-2">
                    <Skeleton className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 rounded-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-6 w-1/3 mb-2" />
              <div className="space-y-2 mb-6">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>

              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        </div>

        {/* All Workshops Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />

                <div className="flex flex-wrap gap-3 mb-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-16 w-full rounded-md mb-4" />

                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

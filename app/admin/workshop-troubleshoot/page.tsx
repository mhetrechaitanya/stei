import WorkshopDiagnostics from "@/app/components/workshop-diagnostics"

export default function WorkshopTroubleshootPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Workshop System Troubleshooting</h1>

      <div className="mb-8">
        <p className="text-gray-700 mb-4">
          This page helps diagnose issues with the workshop system. If workshops are not appearing on your website, use
          the diagnostic tool below to identify and fix the problem.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">Common Issues</h2>
          <ul className="list-disc pl-5 text-blue-700">
            <li>Database connection problems</li>
            <li>Missing workshops table</li>
            <li>No workshop data in the database</li>
            <li>API endpoint errors</li>
            <li>Caching issues</li>
          </ul>
        </div>
      </div>

      <WorkshopDiagnostics />

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Manual Solutions</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium">1. Clear Browser Cache</h3>
            <p className="text-gray-600">Try clearing your browser cache or opening the site in an incognito window.</p>
          </div>

          <div>
            <h3 className="font-medium">2. Check Supabase Dashboard</h3>
            <p className="text-gray-600">
              Verify that your Supabase project is active and that the workshops table exists with data.
            </p>
          </div>

          <div>
            <h3 className="font-medium">3. Add Sample Workshops</h3>
            <p className="text-gray-600">
              Use the "Initialize Workshops Table" button above to add sample workshops to your database.
            </p>
          </div>

          <div>
            <h3 className="font-medium">4. Check Environment Variables</h3>
            <p className="text-gray-600">
              Ensure that your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are
              correctly set.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

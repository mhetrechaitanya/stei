import InitializeStudentsTable from "@/app/components/initialize-students-table"

export default function SetupStudentsTablePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8">Database Setup</h1>
        <InitializeStudentsTable />

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            After initializing the table, return to the{" "}
            <a href="/booking/landing" className="text-[#D40F14] hover:underline">
              booking page
            </a>{" "}
            to continue.
          </p>
        </div>
      </div>
    </div>
  )
}

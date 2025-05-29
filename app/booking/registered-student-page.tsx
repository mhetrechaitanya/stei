import { getSupabaseServer } from "@/lib/supabase-server"
import RegisteredStudentFlow from "@/app/components/registered-student-flow"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function RegisteredStudentPage({ searchParams }) {
  const studentId = searchParams?.studentId || ""
  const workshopId = searchParams?.workshopId || ""
  const batchId = searchParams?.batchId || ""

  // Fetch student data
  let studentData = null
  if (studentId) {
    try {
      const { data: student, error } = await getSupabaseServer()
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single()

      if (!error && student) {
        studentData = student
      }
    } catch (error) {
      console.error("Error fetching student data:", error)
    }
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Student Not Found</h2>
            <p className="text-gray-600 mb-6 text-center">
              We couldn't find your student record. Please register first or verify your student ID.
            </p>
            <div className="flex justify-center">
              <Link
                href="/booking"
                className="px-6 py-2 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11] transition-colors"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#D40F14] text-white py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-white hover:text-white/80 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Workshop Registration</h1>

        <RegisteredStudentFlow studentData={studentData} initialWorkshopId={workshopId} initialBatchId={batchId} />
      </div>

      <Footer />
    </div>
  )
}

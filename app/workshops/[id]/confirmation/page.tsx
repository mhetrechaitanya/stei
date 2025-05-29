import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function ConfirmationPage({ params, searchParams }) {
  const { id: workshopId } = params
  const { studentId, batchId, timeSlotId } = searchParams

  if (!workshopId || !studentId || !batchId || !timeSlotId) {
    redirect(`/workshops/${workshopId}`)
  }

  // Get workshop details
  const supabase = createServerComponentClient({ cookies })

  const { data: workshop, error: workshopError } = await supabase
    .from("workshops")
    .select("*")
    .eq("id", workshopId)
    .single()

  if (workshopError || !workshop) {
    redirect("/workshops")
  }

  // Get batch details
  const { data: batch, error: batchError } = await supabase.from("batches").select("*").eq("id", batchId).single()

  if (batchError || !batch) {
    redirect(`/workshops/${workshopId}`)
  }

  // Get student details
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single()

  if (studentError || !student) {
    redirect(`/workshops/${workshopId}`)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#D40F14] p-6 text-white">
          <h1 className="text-2xl font-bold">Booking Confirmation</h1>
          <p className="mt-2 opacity-90">Please review your booking details before proceeding to payment</p>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Workshop Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg">{workshop.title}</h3>
              <p className="text-gray-600 mt-1">{workshop.description}</p>
              <div className="mt-3 flex items-center">
                <span className="font-bold text-[#D40F14] text-lg">₹{workshop.price}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Batch Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Date:</p>
                  <p className="font-medium">{batch.date}</p>
                </div>
                <div>
                  <p className="text-gray-600">Time:</p>
                  <p className="font-medium">{batch.time}</p>
                </div>
                <div>
                  <p className="text-gray-600">Location:</p>
                  <p className="font-medium">{batch.location || "Online"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Instructor:</p>
                  <p className="font-medium">{batch.instructor || "TBD"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Student Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Name:</p>
                  <p className="font-medium">{student.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email:</p>
                  <p className="font-medium">{student.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Mobile:</p>
                  <p className="font-medium">{student.mobile}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">Total Amount:</span>
              <span className="text-xl font-bold text-[#D40F14]">₹{workshop.price}</span>
            </div>

            <form action="/api/payment/create-order" method="POST">
              <input type="hidden" name="workshopId" value={workshopId} />
              <input type="hidden" name="batchId" value={batchId} />
              <input type="hidden" name="studentId" value={studentId} />
              <input type="hidden" name="amount" value={workshop.price} />

              <button
                type="submit"
                className="w-full bg-[#D40F14] hover:bg-[#B00D11] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

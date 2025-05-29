"use server"

import { revalidatePath } from "next/cache"
import { getAdminClient } from "@/utils/student-db-setup"

// Function to check if students table exists and create it if it doesn't
async function ensureStudentsTable() {
  try {
    const supabase = getAdminClient()

    // Check if students table exists
    const { data, error: checkError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "students")

    // If table doesn't exist, redirect to the setup API
    if (checkError || !data || data.length === 0) {
      console.log("Students table does not exist, redirecting to setup API...")

      try {
        const response = await fetch(
          new URL("/api/setup-students-table", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
        )
        const result = await response.json()

        if (!result.success) {
          console.error("Error setting up students table via API:", result.error)
          return false
        }

        console.log("Students table created successfully via API")
        return true
      } catch (apiError) {
        console.error("Error calling setup-students-table API:", apiError)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error ensuring students table exists:", error)
    return false
  }
}

// Update the getStudents function to use the new API endpoint
export async function getStudents() {
  try {
    // First ensure the table exists
    const tableExists = await ensureStudentsTable()
    if (!tableExists) {
      return { data: [], error: "Students table does not exist" }
    }

    // Use the new API endpoint
    const response = await fetch(
      new URL("/api/students", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Error response from students API:", errorData)
      return { data: null, error: errorData.message || "Failed to fetch students" }
    }

    const result = await response.json()
    console.log("Fetched students:", result.data?.length)
    return { data: result.data, error: null }
  } catch (error) {
    console.error("Exception in getStudents:", error)
    return { data: null, error: error.message || "Failed to fetch students" }
  }
}

export async function createStudent(studentData) {
  try {
    await ensureStudentsTable()

    const supabase = getAdminClient()

    // Format the data for insertion
    const formattedData = {
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone,
      address: studentData.address,
      pincode: studentData.pincode,
      workshop_id: studentData.workshopId || null,
      batch_id: studentData.batchId || null,
      payment_status: studentData.paymentStatus || "pending",
      amount: Number(studentData.amount) || 0,
      transaction_id: studentData.transactionId || null,
      affiliate: studentData.affiliate || null,
      order_id: studentData.order_id || null,
      payment_details: studentData.payment_details || null,
      // These fields might be populated by triggers if they exist
      workshop_name: studentData.workshop_name || null,
      batch_date: studentData.batch_date || null,
      batch_time: studentData.batch_time || null,
    }

    console.log("Creating student with data:", formattedData)

    const { data, error } = await supabase.from("students").insert([formattedData]).select()

    if (error) {
      console.error("Error creating student:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/users")
    revalidatePath("/admin/messages")
    revalidatePath("/admin/emails")
    revalidatePath("/admin/dashboard")
    return { success: true, data }
  } catch (error) {
    console.error("Exception in createStudent:", error)
    return { success: false, error: error.message || "Failed to create student" }
  }
}

export async function updateStudentPayment(studentId, paymentStatus, transactionId = "") {
  try {
    const supabase = getAdminClient()

    const updateData = {
      payment_status: paymentStatus,
    }

    if (transactionId) {
      updateData.transaction_id = transactionId
    }

    const { data, error } = await supabase.from("students").update(updateData).eq("id", studentId).select()

    if (error) {
      console.error("Error updating student payment:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/users")
    revalidatePath("/admin/messages")
    revalidatePath("/admin/emails")
    revalidatePath("/admin/dashboard")
    return { success: true, data }
  } catch (error) {
    console.error("Exception in updateStudentPayment:", error)
    return { success: false, error: error.message || "Failed to update payment status" }
  }
}

export async function getActiveStudents() {
  try {
    // First ensure the table exists
    const tableExists = await ensureStudentsTable()
    if (!tableExists) {
      return { data: [], error: "Students table does not exist" }
    }

    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("payment_status", "paid")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching active students:", error)
      return { data: null, error: error.message }
    }

    console.log("Fetched active students:", data.length)
    return { data, error: null }
  } catch (error) {
    console.error("Exception in getActiveStudents:", error)
    return { data: null, error: error.message || "Failed to fetch active students" }
  }
}

export async function deleteStudent(studentId) {
  try {
    const supabase = getAdminClient()

    const { error } = await supabase.from("students").delete().eq("id", studentId)

    if (error) {
      console.error("Error deleting student:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/users")
    revalidatePath("/admin/messages")
    revalidatePath("/admin/emails")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Exception in deleteStudent:", error)
    return { success: false, error: error.message || "Failed to delete student" }
  }
}

export async function getStudentById(studentId) {
  try {
    const supabase = getAdminClient()

    const { data, error } = await supabase.from("students").select("*").eq("id", studentId).single()

    if (error) {
      console.error("Error fetching student:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Exception in getStudentById:", error)
    return { data: null, error: error.message || "Failed to fetch student" }
  }
}

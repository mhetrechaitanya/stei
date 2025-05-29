"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

interface StudentRegistrationData {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  status?: string
  email_consent?: boolean
  joined_date?: string
}

export async function registerStudent(data: StudentRegistrationData) {
  const supabase = createServerComponentClient({ cookies })

  // Get current timestamp in ISO format for timezone compatibility
  const now = new Date().toISOString()

  try {
    // Insert student data with all fields including timestamps
    const { error } = await supabase.from("students").insert([
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        status: "pending", // Changed from "Pending" to lowercase "pending"
        email_consent: data.email_consent || false,
        joined_date: now.split("T")[0], // Always use current date
        created_at: now, // Include created_at timestamp
        updated_at: now, // Include updated_at timestamp
      },
    ])

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error registering student:", error)
    return {
      success: false,
      error: "Failed to register student. Please try again.",
    }
  }
}

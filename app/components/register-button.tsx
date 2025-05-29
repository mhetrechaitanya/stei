"use client"

import Link from "next/link"

export default function RegisterButton() {
  return (
    <Link
      href="/student-registration"
      className="inline-flex items-center justify-center px-4 py-2 bg-[#D40F14] text-white font-medium rounded-md hover:bg-[#B00D10] focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:ring-offset-2 transition-colors"
    >
      Register Me
    </Link>
  )
}

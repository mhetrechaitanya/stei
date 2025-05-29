"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RegisterRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/student-registration")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D40F14]"></div>
      <p className="ml-3">Redirecting to registration page...</p>
    </div>
  )
}

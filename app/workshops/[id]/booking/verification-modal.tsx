"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (studentId: string) => void
}

export default function VerificationModal({ isOpen, onClose, onSuccess }: VerificationModalProps) {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/verify-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, phone }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Server responded with status: ${response.status}`)
      }

      if (data.verified && data.studentId) {
        onSuccess(data.studentId)
      } else {
        // Student not found, redirect to registration
        window.location.href = "/student-registration"
      }
    } catch (error) {
      console.error("Verification error:", error)
      setError(error instanceof Error ? error.message : "Failed to verify. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Student Verification</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleVerify} className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex flex-col space-y-2">
              <Button type="submit" disabled={isLoading} className="bg-[#D40F14] hover:bg-[#B00D11]">
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </Button>
              <p className="text-sm text-center text-gray-500">
                New student?{" "}
                <a href="/student-registration" className="text-[#D40F14] hover:underline">
                  Register here
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

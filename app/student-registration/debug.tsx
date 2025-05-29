"use client"

import { useState } from "react"

export default function RegistrationDebug() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg"
        aria-label="Debug registration"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="M12 16v.01"></path>
          <path d="M12 8v4"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-white rounded-lg shadow-xl border border-gray-200 w-80">
          <h3 className="font-bold text-lg mb-2">Registration Debug</h3>
          <p className="text-sm mb-2">Current path: {typeof window !== "undefined" ? window.location.pathname : ""}</p>
          <p className="text-sm mb-2">Registration component loaded: ✅</p>
          <button
            onClick={() => (window.location.href = "/student-registration")}
            className="mt-2 w-full bg-[#D40F14] text-white py-2 rounded-md"
          >
            Force Navigate to Registration
          </button>
          <button onClick={() => setIsOpen(false)} className="mt-2 w-full border border-gray-300 py-2 rounded-md">
            Close
          </button>
        </div>
      )}
    </div>
  )
}

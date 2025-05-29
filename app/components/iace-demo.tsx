"use client"

import { useState } from "react"

export default function IACEDemo() {
  const [fontSize, setFontSize] = useState(36)

  const increaseFontSize = () => setFontSize((prev) => prev + 4)
  const decreaseFontSize = () => setFontSize((prev) => Math.max(16, prev - 4))

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg my-8 border-2 border-gray-300">
      <h2 className="text-2xl font-bold mb-6 text-center">iACE Styling Demonstration</h2>

      <div className="flex justify-center gap-4 mb-8">
        <button onClick={decreaseFontSize} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Decrease Size
        </button>
        <button onClick={increaseFontSize} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Increase Size
        </button>
      </div>

      <div className="space-y-8">
        {/* Original text without styling */}
        <div className="p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Without Styling:</h3>
          <p style={{ fontSize: `${fontSize}px` }} className="font-bold">
            STEI launches its iACE Series Workshops
          </p>
        </div>

        {/* Text with iACE styling */}
        <div className="p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">With Styling:</h3>
          <p style={{ fontSize: `${fontSize}px` }} className="font-bold">
            STEI launches its i<span className="text-[#900000]">ACE</span> Series Workshops
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className="p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Comparison of just the word:</h3>
          <div className="flex justify-center items-center gap-12">
            <div className="text-center">
              <p className="text-sm mb-2">Without Styling</p>
              <p style={{ fontSize: `${fontSize}px` }} className="font-bold">
                iACE
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm mb-2">With Styling</p>
              <p style={{ fontSize: `${fontSize}px` }} className="font-bold">
                i<span className="text-[#900000]">ACE</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold mb-2">Current CSS:</h3>
        <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
          {`i<span className="text-[#900000]">ACE</span>`}
        </pre>
        <p className="mt-4 text-sm">
          The "i" is in the default text color, while "ACE" is styled with the color #900000.
        </p>
      </div>
    </div>
  )
}

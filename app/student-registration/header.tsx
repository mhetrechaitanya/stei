import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function RegistrationHeader() {
  return (
    <div className="bg-[#D40F14] text-white py-4">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-white hover:text-white/80 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

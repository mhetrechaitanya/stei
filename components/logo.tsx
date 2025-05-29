import Image from "next/image"
import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <div className="bg-white p-2 rounded-md">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/STEI-Logo-Final-y6nOYUE3jmODBGwK7QJbttdpZZEGTm.png"
          alt="stei - Empowering Individuals"
          width={200}
          height={100}
          className="h-14 w-auto"
          priority
        />
      </div>
    </Link>
  )
}

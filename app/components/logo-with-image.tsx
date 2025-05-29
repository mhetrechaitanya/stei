import Link from "next/link"
import Image from "next/image"

export default function LogoWithImage() {
  return (
    <Link href="/" className="flex items-center">
      <div className="flex items-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/STEI-Logo-Final-y6nOYUE3jmODBGwK7QJbttdpZZEGTm.png"
          alt="stei - Empowering Individuals"
          width={160}
          height={60}
          className="h-10 w-auto"
          priority
        />
      </div>
    </Link>
  )
}

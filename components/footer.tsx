"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin } from "lucide-react"
import SteiText from "@/app/components/stei-text"

export default function Footer() {
  return (
    <footer className="bg-[#D40F14] text-white pt-16 pb-8 relative">
      {/* Wave top decoration */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform translate-y-[-98%]">
        <svg
          className="relative block w-full h-[70px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#D40F14"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/STEI-Logo-Final-y6nOYUE3jmODBGwK7QJbttdpZZEGTm.png"
                alt="STEI Logo"
                width={120}
                height={60}
                className="h-auto"
              />
            </div>
            <p className="text-white/90 mb-4">
              We are dedicated to empowering individuals through personalized coaching and interactive workshops
              designed to enhance personal and professional growth.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/share/1QYavBGR35/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Facebook className="h-5 w-5" />
                </div>
              </Link>
              <Link
                href="https://www.instagram.com/stei_edutech?igsh=MWt3MTJlenJvNXgzNg=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Instagram className="h-5 w-5" />
                </div>
              </Link>
              <Link
                href="https://www.linkedin.com/company/stei-edutech-llp/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                  clipRule="evenodd"
                />
              </svg>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="hover:underline flex items-center">
                  <span className="mr-2">›</span> About Us
                </Link>
              </li>
              <li>
                <Link href="/workshops" className="hover:underline flex items-center">
                  <span className="mr-2">›</span> Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services - Changed to Policies */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 010 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              Policies
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms-conditions" className="hover:underline flex items-center">
                  <span className="mr-2">›</span> Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:underline flex items-center">
                  <span className="mr-2">›</span> Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:underline flex items-center">
                  <span className="mr-2">›</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-cancellation" className="hover:underline flex items-center">
                  <span className="mr-2">›</span> Refund & Cancellation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 mt-1 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <SteiText /> EDUTECH LLP, 1ST FLOOR, SAI HILL SEVA SANGH, PASCAL WADI, MADH ISLAND, MALAD (W), MUMBAI
                  - 400061
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>support@stei.pro</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/80">
            © {new Date().getFullYear()} <SteiText />. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Wave bottom decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
        <svg
          className="relative block w-full h-[70px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#D40F14"
          ></path>
        </svg>
      </div>
    </footer>
  )
}

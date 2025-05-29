"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Logo from "./logo"
import { usePathname } from "next/navigation"

// Navigation structure with main and sub headings
const navigation = [
  { name: "Home", href: "/", subItems: [] },
  {
    name: "About",
    href: "/about",
    subItems: [
      { name: "The stei Story: Empowering Individuals", href: "/about/stei-story" },
      { name: "Vision", href: "/about/vision" },
      {
        name: "Founder Details",
        href: "/about/founder",
        subItems: [
          { name: "Qualifications", href: "/about/founder#qualifications" },
          { name: "Certification", href: "/about/founder#certification" },
        ],
      },
      { name: "Our Mentors & Facilitators", href: "/about#mentors" },
    ],
  },
  {
    name: "Products & Services",
    href: "/products-services",
    subItems: [],
  },
  {
    name: "Our Impressions",
    href: "/impressions",
    subItems: [{ name: "Personal Experiences with Mentor", href: "/impressions#experiences" }],
  },
  { name: "Register Me", href: "/student-registration", subItems: [] },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()

  // Check if user is in admin section
  useEffect(() => {
    try {
      // Check if the current path starts with /admin
      const isAdminPath = pathname?.startsWith("/admin")

      // Check if user is logged in as admin
      let isLoggedIn = false
      try {
        isLoggedIn = typeof window !== "undefined" ? localStorage.getItem("isLoggedIn") === "true" : false
      } catch (error) {
        console.error("Error accessing localStorage:", error)
      }

      // Set admin status - user is admin if they're on an admin path and logged in
      setIsAdmin(isAdminPath && isLoggedIn)
    } catch (error) {
      console.error("Error in admin check:", error)
      setIsAdmin(false)
    }
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  // Close dropdowns when clicking outside
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDropdowns({})
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Ensure navigation is defined and has items
  const safeNavigation = Array.isArray(navigation) ? navigation : []

  return (
    <header ref={headerRef} className="w-full bg-[#D40F14] text-white relative z-40">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row items-center">
          {/* Logo */}
          <div className="flex items-center py-2 md:mr-8">
            <Logo />
          </div>

          {/* Navigation Container with Black Background and Curved Borders */}
          {!isAdmin && (
            <div className="validnavs w-full md:flex-1">
              <div className="container bg-black py-2 px-4 rounded-full shadow-md">
                {/* Desktop Navigation - Centered */}
                <nav className="hidden md:flex justify-center space-x-4">
                  {safeNavigation.map((item) => (
                    <div key={item.name} className="relative group">
                      {item.subItems && item.subItems.length > 0 ? (
                        <button
                          onClick={(e) => e.preventDefault()}
                          className="flex items-center text-white hover:text-white/80 font-medium transition-colors px-4 py-2"
                        >
                          {item.name}
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className="flex items-center text-white hover:text-white/80 font-medium transition-colors px-4 py-2"
                        >
                          {item.name}
                        </Link>
                      )}

                      {item.subItems && item.subItems.length > 0 && (
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200">
                          <div className="py-1">
                            {item.subItems.map((subItem) => (
                              <HoverDropdownItem key={subItem.name} item={subItem} depth={0} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex justify-end">
                  <button
                    className="text-white focus:outline-none"
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMenuOpen}
                  >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {!isAdmin && (
          <div
            className={cn(
              "md:hidden transition-all duration-300 ease-in-out",
              isMenuOpen ? "block max-h-[80vh] overflow-y-auto" : "hidden max-h-0",
            )}
          >
            <div className="flex flex-col space-y-4 pt-4 pb-3 bg-black rounded-xl mt-2 p-4 shadow-lg">
              {safeNavigation.map((item) => (
                <MobileNavItem key={item.name} item={item} toggleMenu={toggleMenu} />
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

// Hover Dropdown Item Component
function HoverDropdownItem({
  item,
  depth = 0,
}: {
  item: any
  depth: number
}) {
  // Add safety check for subItems
  const hasSubItems = item && item.subItems && Array.isArray(item.subItems) && item.subItems.length > 0

  return (
    <div className="relative group/subitem">
      <Link
        href={item.href || "#"}
        className={cn(
          "block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 flex items-center justify-between",
          depth > 0 && "pl-8",
        )}
      >
        <span>{item.name}</span>
        {hasSubItems && <ChevronDown className="h-4 w-4" />}
      </Link>

      {hasSubItems && (
        <div className="absolute left-full top-0 w-64 bg-white rounded-md shadow-lg z-50 opacity-0 invisible group-hover/subitem:opacity-100 group-hover/subitem:visible transition-all duration-300">
          <div className="py-1">
            {item.subItems.map((subItem: any) => (
              <HoverDropdownItem key={subItem.name} item={subItem} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Mobile Navigation Item
function MobileNavItem({
  item,
  toggleMenu,
}: {
  item: any
  toggleMenu: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  // Add safety check for subItems
  const hasSubItems = item && item.subItems && Array.isArray(item.subItems) && item.subItems.length > 0

  const toggleSubMenu = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        {hasSubItems ? (
          <button
            className="text-white hover:text-white/80 font-medium py-2 transition-colors text-left"
            onClick={(e) => toggleSubMenu(e)}
          >
            {item.name}
          </button>
        ) : (
          <Link
            href={item.href || "#"}
            className="text-white hover:text-white/80 font-medium py-2 transition-colors"
            onClick={toggleMenu}
          >
            {item.name}
          </Link>
        )}
        {hasSubItems && (
          <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2" aria-expanded={isOpen}>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "transform rotate-180")} />
          </button>
        )}
      </div>

      {hasSubItems && isOpen && (
        <div className="pl-4 border-l border-white/20 ml-2">
          {item.subItems.map((subItem: any) => (
            <MobileSubItem key={subItem.name} item={subItem} toggleMenu={toggleMenu} depth={1} />
          ))}
        </div>
      )}
    </div>
  )
}

// Mobile Sub Navigation Item
function MobileSubItem({
  item,
  toggleMenu,
  depth = 1,
}: {
  item: any
  toggleMenu: () => void
  depth: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  // Add safety check for subItems
  const hasSubItems = item && item.subItems && Array.isArray(item.subItems) && item.subItems.length > 0

  const toggleSubMenu = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="my-2">
      <div className="flex items-center justify-between">
        <Link
          href={item.href || "#"}
          className={cn(
            "text-white/90 hover:text-white font-medium py-1 transition-colors text-sm",
            depth > 1 && "text-white/80 text-xs",
          )}
          onClick={(e) => {
            if (!hasSubItems) {
              toggleMenu()
            } else {
              toggleSubMenu(e)
            }
          }}
        >
          {item.name}
        </Link>
        {hasSubItems && (
          <button onClick={() => setIsOpen(!isOpen)} className="text-white/90 p-1" aria-expanded={isOpen}>
            <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "transform rotate-180")} />
          </button>
        )}
      </div>

      {hasSubItems && isOpen && (
        <div className="pl-4 border-l border-white/20 ml-2">
          {item.subItems.map((subItem: any) => (
            <MobileSubItem key={subItem.name} item={subItem} toggleMenu={toggleMenu} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

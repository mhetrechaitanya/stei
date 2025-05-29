"use client"

import { useState, useEffect, useCallback, memo } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import dynamic from "next/dynamic"

// Dynamically import the logo component with no SSR to improve initial load time
const SteiLogo = dynamic(() => import("./stei-logo"), { ssr: false })

// Define menu items outside component to prevent recreation on each render
const menuItems = [
  { name: "Home", href: "/" },
  {
    name: "About",
    href: "/about",
    submenu: [
      { name: "The STEI Story", href: "/about/stei-story" },
      { name: "Vision", href: "/about/vision" },
      { name: "Founder", href: "/about/founder" },
    ],
  },
  { name: "Workshops", href: "/workshops" },
  { name: "Products & Services", href: "/products-services" },
  { name: "Experiences", href: "/experiences" },
  { name: "Impressions", href: "/impressions" },
  { name: "Contact", href: "/contact" },
]

// Memoized submenu component to prevent unnecessary re-renders
const SubMenu = memo(({ subItems, isActive }) => (
  <div className="py-1">
    {subItems.map((subitem) => (
      <Link
        key={subitem.name}
        href={subitem.href}
        className={`block px-4 py-2 text-sm ${
          isActive(subitem.href) ? "text-[#D40F14] bg-gray-50" : "text-gray-700 hover:text-[#D40F14] hover:bg-gray-50"
        }`}
        prefetch={false}
      >
        {subitem.name}
      </Link>
    ))}
  </div>
))

SubMenu.displayName = "SubMenu"

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Memoize scroll handler to prevent recreation on each render
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    // Use passive event listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Memoize toggle function to prevent recreation on each render
  const toggleSubmenu = useCallback((name) => {
    setOpenSubmenu((prev) => (prev === name ? null : name))
  }, [])

  // Memoize isActive function to prevent recreation on each render
  const isActive = useCallback(
    (href) => {
      if (href === "/") {
        return pathname === href
      }
      return pathname?.startsWith(href)
    },
    [pathname],
  )

  // Memoize toggle menu function
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-gradient-to-r from-black/70 to-black/70 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <SteiLogo
              className={`text-2xl ${scrolled ? "text-gray-800" : "text-white"}`}
              accentColor="text-[#D40F14]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.submenu ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleSubmenu(item.name)
                      }}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                        isActive(item.href)
                          ? "text-[#D40F14]"
                          : scrolled
                            ? "text-gray-700 hover:text-[#D40F14]"
                            : "text-white hover:text-white/80"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    <div className="absolute left-0 mt-2 w-64 origin-top-left rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <SubMenu subItems={item.submenu} isActive={isActive} />
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? "text-[#D40F14]"
                        : scrolled
                          ? "text-gray-700 hover:text-[#D40F14]"
                          : "text-white hover:text-white/80"
                    }`}
                    prefetch={false}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/student-registration"
              className="text-gray-700 hover:text-[#D40F14] px-3 py-2 rounded-md text-sm font-medium"
              prefetch={false}
            >
              Register
            </Link>
          </nav>

          {/* Book Now Button */}
          <Link
            href="/booking"
            className="hidden lg:block bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            prefetch={false}
          >
            Book Now
          </Link>

          {/* Mobile Menu Button - Optimized with useCallback */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X className={`h-6 w-6 ${scrolled ? "text-gray-800" : "text-white"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${scrolled ? "text-gray-800" : "text-white"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Only render when needed */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }} // Reduced animation time
            className="lg:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-1">
                {menuItems.map((item) => (
                  <div key={item.name}>
                    {item.submenu ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleSubmenu(item.name)
                          }}
                          className={`px-3 py-2 rounded-md text-base font-medium flex justify-between items-center w-full ${
                            isActive(item.href) ? "text-[#D40F14]" : "text-gray-700 hover:text-[#D40F14]"
                          }`}
                        >
                          {item.name}
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${openSubmenu === item.name ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence>
                          {openSubmenu === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 space-y-1 mt-1 overflow-hidden"
                            >
                              {item.submenu.map((subitem) => (
                                <Link
                                  key={subitem.name}
                                  href={subitem.href}
                                  className={`block px-3 py-2 rounded-md text-sm flex items-center ${
                                    isActive(subitem.href)
                                      ? "text-[#D40F14] bg-gray-50"
                                      : "text-gray-600 hover:text-[#D40F14] hover:bg-gray-50"
                                  }`}
                                  prefetch={false}
                                >
                                  <ChevronRight className="h-3 w-3 mr-1" />
                                  {subitem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`px-3 py-2 rounded-md text-base font-medium block ${
                          isActive(item.href) ? "text-[#D40F14]" : "text-gray-700 hover:text-[#D40F14]"
                        }`}
                        prefetch={false}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <Link
                  href="/student-registration"
                  className="px-3 py-2 rounded-md text-base font-medium block text-gray-700 hover:text-[#D40F14]"
                  prefetch={false}
                >
                  Register
                </Link>
                <Link
                  href="/booking"
                  className="bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium py-3 px-4 rounded-md text-center mt-4 transition-all duration-300 shadow-md"
                  prefetch={false}
                >
                  Book Now
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// Export as memoized component to prevent unnecessary re-renders
export default memo(Header)

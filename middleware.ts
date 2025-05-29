import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Cache the response headers to avoid recreating them on each request
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Create the response
  const response = NextResponse.next()

  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add cache control for static assets
  if (
    path.startsWith("/images/") ||
    path.startsWith("/fonts/") ||
    path.includes(".svg") ||
    path.includes(".jpg") ||
    path.includes(".png")
  ) {
    response.headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800")
  }

  return response
}

// No specific matcher needed anymore
export const config = {
  matcher: [],
}

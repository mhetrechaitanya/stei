import { NextResponse } from "next/server"

export async function GET() {
  // Create a safe version of env vars for debugging
  const safeEnvVars = Object.keys(process.env)
    .filter((key) => key.includes("SUPABASE") || key.includes("POSTGRES"))
    .reduce((obj, key) => {
      // Only show if env var exists, not its value
      obj[key] = process.env[key] ? "[SET]" : "[NOT SET]"
      return obj
    }, {})

  return NextResponse.json({
    message: "Environment variables debug info",
    supabaseEnvVars: safeEnvVars,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}

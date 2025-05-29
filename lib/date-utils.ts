import { parseISO, isValid } from "date-fns"

/**
 * Parses a date string in various formats
 * @param dateString The date string to parse
 * @returns A Date object if parsing was successful, null otherwise
 */
export function parseFlexibleDate(dateString) {
  if (!dateString) return null

  // Handle TBD dates
  if (dateString.includes("TBD")) {
    return null
  }

  try {
    // Try ISO format (YYYY-MM-DD)
    if (dateString.includes("-")) {
      const date = parseISO(dateString)
      if (isValid(date)) return date
    }

    // Try "15 March 2025" format
    const parts = dateString.split(/\s+|,\s*/)
    if (parts.length >= 3) {
      const [day, month, year] = parts
      const monthMap = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11,
      }

      if (monthMap[month] !== undefined) {
        const date = new Date(Number.parseInt(year), monthMap[month], Number.parseInt(day))
        if (isValid(date)) return date
      }
    }

    // Try to parse as a JavaScript Date
    const date = new Date(dateString)
    if (isValid(date)) return date

    return null
  } catch (error) {
    console.error("Error parsing date:", dateString, error)
    return null
  }
}

/**
 * Checks if a date string represents a TBD date
 */
export function isTBDDate(dateString) {
  if (!dateString) return true
  return dateString.includes("TBD")
}

/**
 * Formats a date for display
 */
export function formatReadableDate(date: Date) {
  // Format: "15 March 2025"
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export function formatDisplayDate(dateString) {
  if (!dateString || dateString.includes("TBD")) {
    return "Date to be announced"
  }

  const date = parseFlexibleDate(dateString)
  if (!date) return dateString

  // Format: "15 March 2025"
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

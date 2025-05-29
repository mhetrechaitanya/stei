import { parseFlexibleDate } from "./date-utils"

/**
 * Formats raw batch data from the database into the structure expected by the calendar component
 */
export function formatBatchesForCalendar(rawBatches) {
  if (!rawBatches || !Array.isArray(rawBatches)) {
    return []
  }

  return rawBatches.map((batch) => {
    // Check if this is a TBD batch
    const isTBD = batch.date?.includes("TBD") || !batch.date

    // Create a time slot from the batch data
    const timeSlot = {
      id: batch.id,
      time: batch.time || "10:00 AM - 12:00 PM",
      location: batch.location || "Online",
      slots: batch.slots || 15,
      enrolled: batch.enrolled || 0,
    }

    // Return the formatted batch with the time slot
    return {
      id: batch.id,
      date: batch.date || "TBD",
      timeSlots: [timeSlot],
      isTBD: isTBD,
    }
  })
}

/**
 * Validates batch data to ensure it has the required fields
 */
export function validateBatch(batch) {
  if (!batch) return false
  if (!batch.id) return false

  // TBD batches are valid even without a specific date
  if (batch.date?.includes("TBD") || !batch.date) {
    return true
  }

  // For non-TBD batches, check if the date is valid
  const parsedDate = parseFlexibleDate(batch.date)
  if (!parsedDate) return false

  return true
}

/**
 * Checks if a workshop has valid batches
 */
export function hasValidBatches(workshop) {
  if (!workshop) return false
  if (!workshop.batches || !Array.isArray(workshop.batches)) return false
  if (workshop.batches.length === 0) return false

  // Check if at least one batch is valid
  return workshop.batches.some(validateBatch)
}

/**
 * Separates batches into TBD and scheduled batches
 */
export function separateBatches(batches) {
  if (!batches || !Array.isArray(batches)) {
    return { tbdBatches: [], scheduledBatches: [] }
  }

  const tbdBatches = []
  const scheduledBatches = []

  batches.forEach((batch) => {
    if (batch.date?.includes("TBD") || !batch.date) {
      tbdBatches.push({ ...batch, isTBD: true })
    } else {
      scheduledBatches.push(batch)
    }
  })

  return { tbdBatches, scheduledBatches }
}

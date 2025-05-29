import { addDays } from "date-fns"
import { formatReadableDate } from "./date-utils"

/**
 * Generates mock workshop batch data for testing
 * @param workshopId The ID of the workshop
 * @param numBatches Number of batches to generate
 * @returns Array of mock batch objects
 */
export function generateMockBatches(workshopId: string, numBatches = 5) {
  const startDate = new Date()
  const batches = []

  for (let i = 0; i < numBatches; i++) {
    const batchDate = addDays(startDate, i * 2 + 3) // Skip a few days between batches
    const formattedDate = formatReadableDate(batchDate)

    const timeSlots = [
      {
        id: `ts-${workshopId}-${i}-1`,
        time: "10:00 AM - 12:00 PM",
        location: "Online Session",
        slots: 20,
        enrolled: Math.floor(Math.random() * 10),
      },
    ]

    // Add a second time slot for some batches
    if (i % 2 === 0) {
      timeSlots.push({
        id: `ts-${workshopId}-${i}-2`,
        time: "2:00 PM - 4:00 PM",
        location: "Online Session",
        slots: 15,
        enrolled: Math.floor(Math.random() * 8),
      })
    }

    batches.push({
      id: `batch-${workshopId}-${i}`,
      date: formattedDate,
      timeSlots: timeSlots,
    })
  }

  return batches
}

/**
 * Generates a mock workshop with batches for testing
 */
export function generateMockWorkshop() {
  const workshopId = "mock-workshop-" + Math.floor(Math.random() * 1000)

  return {
    id: workshopId,
    title: "Mock Workshop for Testing",
    description: "This is a mock workshop generated for testing the batch calendar component",
    price: 1999,
    batches: generateMockBatches(workshopId),
  }
}

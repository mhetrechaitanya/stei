"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock, MapPin, Users, X } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
} from "date-fns"

// Define types for our data structure
interface BatchTimeSlot {
  id: string
  time: string
  location: string
  slots: number
  enrolled: number
  instructor: string
}

interface Batch {
  id: string
  date: string
  timeSlots: BatchTimeSlot[]
}

interface Workshop {
  id: string
  title: string
  batches: Batch[]
}

interface BatchCalendarSelectorProps {
  isOpen: boolean
  onClose: () => void
  workshop: Workshop
  onBatchSelected: (batchId: string, timeSlotId: string) => void
}

export default function BatchCalendarSelector({
  isOpen,
  onClose,
  workshop,
  onBatchSelected,
}: BatchCalendarSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<BatchTimeSlot | null>(null)
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [allDatesSelected, setAllDatesSelected] = useState(false);

  // Create a map of dates to batches for easy lookup
  const [batchesByDate, setBatchesByDate] = useState<Record<string, Batch>>({})

  // Process workshop data when it changes
  useEffect(() => {
    if (workshop?.batches) {
      const batchMap: Record<string, Batch> = {}
      const dates: Date[] = []

      workshop.batches.forEach((batch) => {
        const dateKey = batch.date
        batchMap[dateKey] = batch

        // Add to available dates array
        try {
          const parsedDate = parseISO(batch.date)
          dates.push(parsedDate)
        } catch (e) {
          console.error("Error parsing date:", batch.date)
        }
      })

      setBatchesByDate(batchMap)
      setAvailableDates(dates)

      // If there are available dates, set the current month to the month of the first available date
      if (dates.length > 0) {
        setCurrentMonth(dates[0])
      }
    }
  }, [workshop])

  // Navigation functions
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  // Get all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  // Check if a date has batches
  const hasBatches = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd")
    return !!batchesByDate[dateKey]
  }

  // Get total available slots for a date
  const getAvailableSlotsForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd")
    const batch = batchesByDate[dateKey]

    if (!batch) return 0

    return batch.timeSlots.reduce((total, slot) => {
      const availableSlots = Math.max(0, slot.slots - slot.enrolled)
      return total + availableSlots
    }, 0)
  }

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (hasBatches(date)) {
      setSelectedDate(date);
      setSelectedTimeSlot(null);
      setAllDatesSelected(true); // Automatically select all dates
      // Optionally, you can call onBatchSelected for all batches here if needed
    }
  }

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: BatchTimeSlot) => {
    setSelectedTimeSlot(timeSlot)
    if (selectedBatch) {
      onBatchSelected(selectedBatch.id, timeSlot.id)
    }
  }

  // Handle continue to booking
  const handleContinueToBooking = () => {
    if (selectedTimeSlot && selectedBatch) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Select a Batch</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before the start of the month */}
            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, index) => (
              <div key={`empty-start-${index}`} className="h-12"></div>
            ))}

            {/* Days of the month */}
            {daysInMonth.map((day) => {
              const isToday = isSameDay(day, new Date())
              const dateKey = format(day, "yyyy-MM-dd")
              const hasBatchesForDay = !!batchesByDate[dateKey]
              const isSelected = selectedDate && isSameDay(selectedDate, day)

              return (
                <button
                  key={day.toString()}
                  onClick={() => handleDateClick(day)}
                  disabled={!hasBatchesForDay}
                  className={`h-12 flex items-center justify-center relative transition-all ${
                    isSelected
                      ? "bg-[#D40F14] text-white font-bold"
                      : hasBatchesForDay
                        ? "bg-[#FFF5F5] text-[#D40F14] hover:bg-[#FFECEC] cursor-pointer font-medium"
                        : isToday
                          ? "border border-gray-300 text-gray-700"
                          : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {format(day, "d")}

                  {/* Indicator dot for dates with batches */}
                  {hasBatchesForDay && !isSelected && (
                    <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#D40F14]"></div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Time slots for selected date */}
          {selectedDate && selectedBatch && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4">Available batches for {format(selectedDate, "MMMM d, yyyy")}:</h3>

              <div className="space-y-3">
                {selectedBatch.timeSlots.map((timeSlot) => {
                  const isFull = timeSlot.slots - timeSlot.enrolled <= 0
                  const isSelected = selectedTimeSlot?.id === timeSlot.id
                  const availableSlots = timeSlot.slots - timeSlot.enrolled

                  return (
                    <div
                      key={timeSlot.id}
                      onClick={() => !isFull && handleTimeSlotSelect(timeSlot)}
                      className={`p-4 rounded-lg border transition-all ${
                        isFull
                          ? "border-gray-200 bg-gray-100 opacity-70 cursor-not-allowed"
                          : isSelected
                            ? "border-[#D40F14] bg-[#FFF5F5] shadow-md cursor-pointer"
                            : "border-gray-200 hover:border-[#FFCDD2] hover:bg-[#FFFAFA] cursor-pointer"
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-[#D40F14] mr-2" />
                          <span className="font-medium">{timeSlot.time}</span>
                        </div>

                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-[#D40F14] mr-2" />
                          <span>{timeSlot.location || "Online Session"}</span>
                        </div>

                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-[#D40F14] mr-2" />
                          <span>
                            {isFull ? (
                              <span className="text-gray-500">Batch Full</span>
                            ) : (
                              <>
                                <span className="font-medium text-[#D40F14]">{availableSlots}</span> slots left
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="flex justify-end">
            <button
              onClick={handleContinueToBooking}
              disabled={!selectedTimeSlot}
              className={`px-6 py-3 rounded-md transition-colors ${
                selectedTimeSlot
                  ? "bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue to Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

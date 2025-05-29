"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock, MapPin, Users, X, Calendar, Info } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isWithinInterval,
  isBefore,
  isAfter,
} from "date-fns"

interface Batch {
  id: string
  start_date?: string
  end_date?: string
  start_time?: string
  end_time?: string
  date?: string
  time?: string
  location?: string
  slots?: number
  enrolled?: number
  instructor?: string
  schedule?: string
  status?: string
}

interface Workshop {
  id: string
  title: string
  description?: string
  price: number
  batches: Batch[]
}

interface CalendarBatchSelectorProps {
  isOpen: boolean
  onClose: () => void
  workshop: Workshop
  onBatchSelected: (batch: Batch) => void
  onContinue: (batch: Batch) => void
}

export default function CalendarBatchSelector({
  isOpen,
  onClose,
  workshop,
  onBatchSelected,
  onContinue,
}: CalendarBatchSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [batchesByDate, setBatchesByDate] = useState<Record<string, Batch[]>>({})
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState<{start: Date | null; end: Date | null}>({
    start: null,
    end: null
  })

  console.log("data in calendar batch selector : ", workshop);

  // Parse batch dates into Date objects for the calendar
  useEffect(() => {
    if (workshop?.batches && Array.isArray(workshop.batches)) {
      const dates: Date[] = []
      const batchMap: Record<string, Batch[]> = {}
      let startDate: Date | null = null
      let endDate: Date | null = null

      workshop.batches.forEach((batch) => {
        try {
          // Skip batches without necessary date properties
          if (!batch) {
            console.warn("Skipping invalid batch")
            return
          }

          // Parse start and end dates if they exist
          let batchStartDate: Date | null = null
          let batchEndDate: Date | null = null

          if (batch.start_date) {
            batchStartDate = parseISO(batch.start_date)
            if (!startDate || isBefore(batchStartDate, startDate)) {
              startDate = batchStartDate
            }
          }

          if (batch.end_date) {
            batchEndDate = parseISO(batch.end_date)
            if (!endDate || isAfter(batchEndDate, endDate)) {
              endDate = batchEndDate
            }
          }

          // If the batch has a single date property, use that for both start and end
          if (batch.date && !batch.start_date && !batch.end_date) {
            let singleDate: Date | null = null
            
            if (typeof batch.date === "string") {
              if (batch.date.includes("-")) {
                // Handle ISO format
                singleDate = parseISO(batch.date)
              } else {
                // Handle "15 March 2025" format
                const parts = batch.date.split(/\s+|,\s*/)
                if (parts.length >= 3) {
                  const [day, month, year] = parts
                  const monthMap: Record<string, number> = {
                    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
                    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
                  }
                  singleDate = new Date(Number.parseInt(year), monthMap[month], Number.parseInt(day))
                }
              }
            }

            if (singleDate && !isNaN(singleDate.getTime())) {
              batchStartDate = singleDate
              batchEndDate = singleDate
              
              if (!startDate || isBefore(singleDate, startDate)) {
                startDate = singleDate
              }
              
              if (!endDate || isAfter(singleDate, endDate)) {
                endDate = singleDate
              }

              const dateKey = format(singleDate, "yyyy-MM-dd")
              if (!batchMap[dateKey]) {
                batchMap[dateKey] = []
              }
              batchMap[dateKey].push(batch)
              dates.push(singleDate)
            }
          }

          // Generate dates in the range and add to available dates
          if (batchStartDate && batchEndDate) {
            const datesInRange = eachDayOfInterval({
              start: batchStartDate,
              end: batchEndDate
            })

            datesInRange.forEach(date => {
              const dateKey = format(date, "yyyy-MM-dd")
              if (!batchMap[dateKey]) {
                batchMap[dateKey] = []
              }
              
              if (!batchMap[dateKey].some(b => b.id === batch.id)) {
                batchMap[dateKey].push(batch)
              }
              
              if (!dates.some(d => isSameDay(d, date))) {
                dates.push(date)
              }
            })
          }
        } catch (error) {
          console.error("Error parsing date:", error)
        }
      })

      setAvailableDates(dates)
      setBatchesByDate(batchMap)
      setDateRange({ start: startDate, end: endDate })

      // If there are available dates, set the current month to the month of the first available date
      if (dates.length > 0) {
        setCurrentMonth(dates[0])
      }

      // Log for debugging
      console.log("Available dates:", dates.length, dates)
      console.log("Batches by date:", Object.keys(batchMap).length, batchMap)
      console.log("Date range:", startDate, endDate)
    }
  }, [workshop])

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  // Get all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const handleDateClick = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd")
    const batchesForDate = batchesByDate[dateKey] || []

    if (batchesForDate.length > 0) {
      setSelectedDate(date)

      // If there's only one batch for this date, select it automatically
      if (batchesForDate.length === 1) {
        setSelectedBatch(batchesForDate[0])
        onBatchSelected(batchesForDate[0])
      } else if (selectedBatch) {
        // If a batch was already selected but user clicked a different date, clear selection
        const batchStillValid = batchesForDate.some((batch) => batch.id === selectedBatch.id)
        if (!batchStillValid) {
          setSelectedBatch(null)
        }
      }
    }
  }

  const handleBatchSelect = (batch: Batch) => {
    setSelectedBatch(batch)
    onBatchSelected(batch)
  }

  const handleContinue = () => {
    if (selectedBatch) {
      setIsLoading(true)
      try {
        onContinue(selectedBatch)
      } catch (error) {
        console.error("Error in batch selection continue:", error)
        setIsLoading(false)
      }
    }
  }

  // Check if a date is within the date range
  const isDateInRange = (date: Date) => {
    if (!dateRange.start || !dateRange.end) return false
    
    return isWithinInterval(date, {
      start: dateRange.start,
      end: dateRange.end
    })
  }

  // Check if a date has available batches
  const hasAvailableBatches = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd")
    return batchesByDate[dateKey] && batchesByDate[dateKey].length > 0
  }

  // Get the number of available slots for a date
  const getAvailableSlotsForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd")
    const batches = batchesByDate[dateKey] || []

    if (batches.length === 0) return 0

    return batches.reduce((total, batch) => {
      const slots = batch.slots || 0
      const enrolled = batch.enrolled || 0
      const availableSlots = Math.max(0, slots - enrolled)
      return total + availableSlots
    }, 0)
  }

  // Show tooltip with batch info
  const handleMouseEnter = (date: Date) => {
    if (hasAvailableBatches(date)) {
      setShowTooltip(format(date, "yyyy-MM-dd"))
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
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

          {/* Workshop Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-lg">{workshop.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{workshop.description}</p>
            <div className="mt-2 inline-block bg-[#FFF5F5] p-2 rounded-md">
              {/* <span className="font-bold text-[#D40F14]">₹{workshop.price}</span> */}
              <span className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
  {Number(workshop.price) === 0 ? "Free" : `₹${workshop.price}`}
</span>

            </div>
            {dateRange.start && dateRange.end && (
              <div className="mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-[#D40F14] mr-2" />
                  <span>Workshop runs from {format(dateRange.start, "MMM d, yyyy")} to {format(dateRange.end, "MMM d, yyyy")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Calendar */}
          <div className="mb-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
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
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before the start of the month */}
              {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, index) => (
                <div key={`empty-start-${index}`} className="h-12 rounded-md"></div>
              ))}

              {/* Days of the month */}
              {daysInMonth.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd")
                const isInRange = isDateInRange(day)
                const hasBatches = hasAvailableBatches(day)
                const availableSlots = getAvailableSlotsForDate(day)
                const isSelected = selectedDate && isSameDay(selectedDate, day)
                const showBatchTooltip = showTooltip === dateKey

                return (
                  <div
                    key={day.toString()}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(day)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => isInRange && hasBatches && handleDateClick(day)}
                      className={`h-12 w-full rounded-md flex flex-col items-center justify-center text-sm transition-all ${
                        isInRange
                          ? hasBatches
                            ? isSelected
                              ? "bg-[#D40F14] text-white font-bold shadow-md"
                              : "bg-[#FFF5F5] text-[#D40F14] hover:bg-[#FFECEC] cursor-pointer"
                            : "bg-gray-100 text-gray-500 cursor-default"
                          : "text-gray-400 bg-gray-50 cursor-default"
                      }`}
                      disabled={!isInRange || !hasBatches}
                    >
                      <span>{format(day, "d")}</span>
                      {isInRange && hasBatches && (
                        <span className="text-xs mt-0.5">
                          {availableSlots} {availableSlots === 1 ? "slot" : "slots"}
                        </span>
                      )}
                    </button>

                    {/* Tooltip for batch info */}
                    {showBatchTooltip && hasBatches && (
                      <div className="absolute z-10 bg-white rounded-md shadow-lg p-3 w-48 text-xs left-1/2 transform -translate-x-1/2 mt-1 border border-gray-200">
                        <div className="font-bold mb-1">{format(day, "EEEE, MMMM d, yyyy")}</div>
                        <div className="text-gray-600">
                          {batchesByDate[dateKey].length} {batchesByDate[dateKey].length === 1 ? "batch" : "batches"}{" "}
                          available
                        </div>
                        <div className="mt-1 text-[#D40F14]">
                          {availableSlots} {availableSlots === 1 ? "slot" : "slots"} remaining
                        </div>
                        {batchesByDate[dateKey][0]?.schedule && (
                          <div className="mt-1 text-gray-600">
                            Schedule: {batchesByDate[dateKey][0].schedule}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              {availableDates.length === 0 && (
                <div className="col-span-7 py-4 text-center text-gray-500">
                  No available batches found. Please check back later or contact support.
                </div>
              )}
            </div>
          </div>

          {/* Batch List for Selected Date */}
          {selectedDate && (
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-[#D40F14] mr-2" />
                <h3 className="font-bold">Batches for {format(selectedDate, "EEEE, MMMM d, yyyy")}:</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batchesByDate[format(selectedDate, "yyyy-MM-dd")]?.map((batch, index) => {
                  const slots = batch.slots || 0
                  const enrolled = batch.enrolled || 0
                  const isFull = slots - enrolled <= 0
                  const isSelected = selectedBatch?.id === batch.id
                  const availableSlots = slots - enrolled
                  const batchTime = batch.time || (batch.start_time ? `${batch.start_time} - ${batch.end_time || ""}` : "All day")

                  return (
                    <div
                      key={batch.id || index}
                      onClick={() => !isFull && handleBatchSelect(batch)}
                      className={`p-4 rounded-lg border transition-all ${
                        isFull
                          ? "border-gray-200 bg-gray-100 opacity-70 cursor-not-allowed"
                          : isSelected
                            ? "border-[#D40F14] bg-[#FFF5F5] shadow-md cursor-pointer"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300 cursor-pointer"
                      }`}
                    >
                      <div className="font-bold mb-2">Batch {batch.id || index + 1}</div>
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 text-[#D40F14] mr-2" />
                        <span className="text-sm">{batchTime}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 text-[#D40F14] mr-2" />
                        <span className="text-sm">{batch.location || "Online Session"}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-[#D40F14] mr-2" />
                        <span className="text-sm">
                          {isFull ? (
                            <span className="font-medium text-gray-500">Batch Full</span>
                          ) : (
                            <>
                              <span className="font-medium text-[#D40F14]">{availableSlots}</span> of{" "}
                              <span>{slots}</span> slots available
                            </>
                          )}
                        </span>
                      </div>

                      {batch.instructor && (
                        <div className="mt-2 text-sm text-gray-600">Instructor: {batch.instructor}</div>
                      )}
                      {batch.schedule && (
                        <div className="mt-2 text-sm text-gray-600">Schedule: {batch.schedule}</div>
                      )}
                      {batch.status && (
                        <div className="mt-2 text-sm text-gray-600">
                          Status: <span className={batch.status === "active" ? "text-green-500" : "text-gray-500"}>{batch.status}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Info message */}
          <div className="mb-6 flex items-start p-3 bg-blue-50 rounded-lg text-sm">
            <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-blue-700">
              Select a date within the workshop period (highlighted in red), then choose your preferred batch time.
              {dateRange.start && dateRange.end && (
                <span className="block mt-1">Workshop period: {format(dateRange.start, "MMM d, yyyy")} to {format(dateRange.end, "MMM d, yyyy")}</span>
              )}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
  onClick={handleContinue}
  disabled={!selectedBatch || isLoading}
  className={`px-6 py-2 rounded-lg transition-colors ${
    selectedBatch && !isLoading
      ? "bg-[#D40F14] hover:bg-[#B00D11] text-white"
      : "bg-gray-200 text-gray-500 cursor-not-allowed"
  }`}
>
  {isLoading
    ? "Processing..."
    : Number(workshop.price) === 0
    ? "Confirm"
    : "Continue to Payment"}
</button>

          </div>
        </div>
      </div>
    </div>
  )
}
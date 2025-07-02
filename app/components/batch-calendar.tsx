"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock, MapPin, Users, Calendar, Info, AlertCircle } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isValid,
} from "date-fns"

interface BatchTimeSlot {
  id: string
  time: string
  location?: string
  slots: number
  enrolled: number
  instructor?: string
}

interface WorkshopBatch {
  id: string
  date: string
  time: string
  slots: number
  enrolled: number
  location?: string
  isTBD?: boolean
}

interface Workshop {
  id: string
  title: string
  description?: string
  price: number
  batches: WorkshopBatch[]
}

interface BatchCalendarProps {
  workshop: Workshop
  onBatchSelected: (batch: WorkshopBatch) => void
  onContinue: () => void
}

export default function BatchCalendar({ workshop, onBatchSelected, onContinue }: BatchCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedBatch, setSelectedBatch] = useState<WorkshopBatch | null>(null)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [batchesByDate, setBatchesByDate] = useState<Record<string, WorkshopBatch[]>>({})
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [tbdBatches, setTbdBatches] = useState<WorkshopBatch[]>([])
  const [showTBDSection, setShowTBDSection] = useState(false)

  // Process batches data when it changes
  useEffect(() => {
    if (workshop?.batches && Array.isArray(workshop.batches)) {
      const dates: Date[] = []
      const batchMap: Record<string, WorkshopBatch[]> = {}
      const tbdBatchesList: WorkshopBatch[] = []

      workshop.batches.forEach((batch) => {
        try {
          // Check if this is a TBD batch
          if (batch.date?.includes("TBD") || !batch.date) {
            batch.isTBD = true
            tbdBatchesList.push(batch)
            return
          }

          // Try to parse the date string
          let batchDate: Date | null = null

          if (typeof batch.date === "string") {
            if (batch.date.includes("-")) {
              // Handle ISO format
              batchDate = parseISO(batch.date)
            } else {
              // Handle "15 March 2025" format
              const parts = batch.date.split(/\s+|,\s*/)
              if (parts.length >= 3) {
                const [day, month, year] = parts
                const monthMap: Record<string, number> = {
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
                batchDate = new Date(Number.parseInt(year), monthMap[month], Number.parseInt(day))
              }
            }
          }

          if (batchDate && isValid(batchDate)) {
            const dateKey = format(batchDate, "yyyy-MM-dd")

            if (!batchMap[dateKey]) {
              batchMap[dateKey] = []
            }

            batchMap[dateKey].push(batch)

            // Only add unique dates
            if (!dates.some((date) => isSameDay(date, batchDate!))) {
              dates.push(batchDate)
            }
          } else {
            console.error("Invalid date format:", batch.date)
          }
        } catch (error) {
          console.error("Error parsing date:", batch.date, error)
        }
      })

      setBatchesByDate(batchMap)
      setAvailableDates(dates)
      setTbdBatches(tbdBatchesList)

      // If there are available dates, set the current month to the month of the first available date
      if (dates.length > 0) {
        setCurrentMonth(dates[0])
      }

      // Log for debugging
      console.log("Available dates:", dates.length, dates)
      console.log("Batches by date:", Object.keys(batchMap).length, batchMap)
      console.log("TBD batches:", tbdBatchesList.length, tbdBatchesList)
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
    const batches = batchesByDate[dateKey] || []

    if (batches.length === 0) return 0

    return batches.reduce((total, batch) => {
      const availableSlots = Math.max(0, batch.slots - batch.enrolled)
      return total + availableSlots
    }, 0)
  }

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (hasBatches(date)) {
      setSelectedDate(date)
      setSelectedBatch(null)
      setShowTBDSection(false)
    }
  }

  // Handle TBD batch selection
  const handleTBDBatchSelect = (batch: WorkshopBatch) => {
    setSelectedBatch(batch)
    setSelectedDate(null)
    setShowTBDSection(true)
    onBatchSelected(batch)
  }

  // Handle batch selection
  const handleBatchSelect = (batch: WorkshopBatch) => {
    setSelectedBatch(batch)
    onBatchSelected(batch)
  }

  // Handle continue to booking
  const handleContinueToBooking = () => {
    if (selectedBatch) {
      onContinue()
    }
  }

  // Show tooltip with batch info
  const handleMouseEnter = (date: Date) => {
    if (hasBatches(date)) {
      setShowTooltip(format(date, "yyyy-MM-dd"))
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Select a Batchkjhg</h2>

      {/* TBD Batches Section */}
      {tbdBatches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            <h3 className="font-bold">Upcoming Batches (Dates To Be Determined)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {tbdBatches.map((batch, index) => (
              <div
                key={batch.id || `tbd-${index}`}
                onClick={() => handleTBDBatchSelect(batch)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedBatch?.id === batch.id && showTBDSection
                    ? "border-[#D40F14] bg-[#FFF5F5] shadow-md"
                    : "border-gray-200 hover:border-[#FFCDD2] hover:bg-[#FFFAFA]"
                }`}
              >
                <div className="font-bold mb-2">Batch {index + 1}</div>
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 text-[#D40F14] mr-2" />
                  <span className="text-sm">Date to be announced</span>
                </div>
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-[#D40F14] mr-2" />
                  <span className="text-sm">{batch.time !== "TBD" ? batch.time : "Time to be announced"}</span>
                </div>
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-[#D40F14] mr-2" />
                  <span className="text-sm">{batch.location || "Online Session"}</span>
                </div>
                <div className="text-sm mt-2">
                  <span className="font-medium text-[#D40F14]">{batch.slots - batch.enrolled}</span> slots left
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-lg text-sm mb-6">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700">
                These batches' exact dates will be announced soon. You can still register your interest and we'll notify
                you when the dates are confirmed.
              </p>
            </div>
          </div>
        </div>
      )}

      {availableDates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendar Column */}
          <div className="md:col-span-2">
            {/* Calendar Navigation */}
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
            <div className="grid grid-cols-7 gap-2 mb-6">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before the start of the month */}
              {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, index) => (
                <div key={`empty-start-${index}`} className="h-14"></div>
              ))}

              {/* Days of the month */}
              {daysInMonth.map((day) => {
                const isToday = isSameDay(day, new Date())
                const dateKey = format(day, "yyyy-MM-dd")
                const hasBatchesForDay = !!batchesByDate[dateKey]
                const isSelected = selectedDate && isSameDay(selectedDate, day)
                const availableSlots = getAvailableSlotsForDate(day)
                const showBatchTooltip = showTooltip === dateKey

                return (
                  <div
                    key={day.toString()}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(day)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => handleDateClick(day)}
                      disabled={!hasBatchesForDay}
                      className={`h-14 w-full flex flex-col items-center justify-center rounded-lg transition-all ${
                        isSelected
                          ? "bg-[#D40F14] text-white font-bold shadow-md"
                          : hasBatchesForDay
                            ? "bg-[#FFF5F5] text-[#D40F14] hover:bg-[#FFECEC] cursor-pointer font-medium"
                            : isToday
                              ? "border border-gray-300 text-gray-700"
                              : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-sm md:text-base">{format(day, "d")}</span>
                      {hasBatchesForDay && (
                        <span className="text-xs mt-0.5">
                          {availableSlots} {availableSlots === 1 ? "slot" : "slots"}
                        </span>
                      )}
                    </button>

                    {/* Tooltip for batch info */}
                    {showBatchTooltip && hasBatchesForDay && (
                      <div className="absolute z-10 bg-white rounded-md shadow-lg p-3 w-48 text-xs left-1/2 transform -translate-x-1/2 mt-1 border border-gray-200">
                        <div className="font-bold mb-1">{format(day, "EEEE, MMMM d, yyyy")}</div>
                        <div className="text-gray-600">
                          {batchesByDate[dateKey]?.length || 0}{" "}
                          {(batchesByDate[dateKey]?.length || 0) === 1 ? "batch" : "batches"} available
                        </div>
                        <div className="mt-1 text-[#D40F14]">
                          {availableSlots} {availableSlots === 1 ? "slot" : "slots"} remaining
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Info message */}
            <div className="flex items-start p-3 bg-blue-50 rounded-lg text-sm mb-6 md:mb-0">
              <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-blue-700">
                Dates highlighted in red have available batches. Click on a date to see available time slots.
              </p>
            </div>
          </div>

          {/* Time slots Column */}
          <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-gray-200 md:pl-6 pt-6 md:pt-0">
            {selectedDate && batchesByDate[format(selectedDate, "yyyy-MM-dd")] && !showTBDSection ? (
              <>
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-[#D40F14] mr-2" />
                  <h3 className="font-bold">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
                </div>

                <div className="space-y-3 mb-6">
                  {batchesByDate[format(selectedDate, "yyyy-MM-dd")]?.map((batch, index) => {
                    const isFull = batch.slots - batch.enrolled <= 0
                    const isSelected = selectedBatch?.id === batch.id
                    const availableSlots = batch.slots - batch.enrolled

                    return (
                      <div
                        key={batch.id || index}
                        onClick={() => !isFull && handleBatchSelect(batch)}
                        className={`p-4 rounded-lg border transition-all ${
                          isFull
                            ? "border-gray-200 bg-gray-100 opacity-70 cursor-not-allowed"
                            : isSelected
                              ? "border-[#D40F14] bg-[#FFF5F5] shadow-md cursor-pointer"
                              : "border-gray-200 hover:border-[#FFCDD2] hover:bg-[#FFFAFA] cursor-pointer"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-[#D40F14] mr-2" />
                            <span className="font-medium">{batch.time}</span>
                          </div>

                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-[#D40F14] mr-2" />
                            <span>{batch.location || "Online Session"}</span>
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
              </>
            ) : showTBDSection && selectedBatch ? (
              <>
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-amber-500 mr-2" />
                  <h3 className="font-bold">Date To Be Announced</h3>
                </div>

                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="font-medium">
                        {selectedBatch.time !== "TBD" ? selectedBatch.time : "Time to be announced"}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-amber-500 mr-2" />
                      <span>{selectedBatch.location || "Online Session"}</span>
                    </div>

                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-amber-500 mr-2" />
                      <span>
                        <span className="font-medium">{selectedBatch.slots - selectedBatch.enrolled}</span> slots left
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg text-sm mb-6">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-700">
                      This batch's exact date will be announced soon. You can still register your interest and we'll
                      notify you when the date is confirmed.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">Select a date to view available time slots</div>
            )}

            {/* Action button */}
            <div className="flex justify-center">
              <button
                onClick={handleContinueToBooking}
                disabled={!selectedBatch}
                className={`w-full py-3 rounded-md transition-colors ${
                  selectedBatch
                    ? "bg-[#D40F14] hover:bg-[#B00D11] text-white font-medium"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue to Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {availableDates.length === 0 && tbdBatches.length === 0 && (
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <div className="mb-4">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No Scheduled Batches</h3>
          <p className="text-gray-600 mb-4">
            There are currently no scheduled batches for this workshop. Please check back later or contact us for more
            information.
          </p>
        </div>
      )}
    </div>
  )
}

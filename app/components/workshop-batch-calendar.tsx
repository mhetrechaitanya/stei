"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock, MapPin, Users, X, Calendar, Info, AlertCircle } from "lucide-react"
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
import Image from "next/image"

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
  timeSlots: BatchTimeSlot[]
  isTBD?: boolean
}

interface Workshop {
  id: string
  title: string
  description?: string
  price: number
  image?: string
}

interface WorkshopBatchCalendarProps {
  isOpen: boolean
  onClose: () => void
  workshop: Workshop
  batches: WorkshopBatch[]
  onBatchSelected: (batchId: string, timeSlotId: string) => void
  onContinue?: () => void
  debug?: boolean
}

export default function WorkshopBatchCalendar({
  isOpen,
  onClose,
  workshop,
  batches,
  onBatchSelected,
  onContinue,
  debug = false,
}: WorkshopBatchCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<BatchTimeSlot | null>(null)
  const [selectedBatch, setSelectedBatch] = useState<WorkshopBatch | null>(null)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [batchesByDate, setBatchesByDate] = useState<Record<string, WorkshopBatch>>({})
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [hasTBDBatches, setHasTBDBatches] = useState(false)
  const [showTBDSection, setShowTBDSection] = useState(false)
  const [tbdBatches, setTbdBatches] = useState<WorkshopBatch[]>([])

  // Process batches data when it changes
  useEffect(() => {
    console.log("Processing batches:", batches)

    if (!batches || !Array.isArray(batches)) {
      console.error("Batches is not an array:", batches)
      return
    }

    const batchMap: Record<string, WorkshopBatch> = {}
    const dates: Date[] = []
    const tbdBatchesList: WorkshopBatch[] = []

    batches.forEach((batch) => {
      try {
        if (!batch) return
        if (!batch.date) return

        // Check if the date is TBD
        if (batch.date.includes("TBD") || batch.isTBD) {
          batch.isTBD = true
          tbdBatchesList.push(batch)
          return
        }

        // Try to parse the date string
        let parsedDate: Date | null = null

        // Handle different date formats
        if (typeof batch.date === "string") {
          if (batch.date.includes("-")) {
            // ISO format (YYYY-MM-DD)
            parsedDate = parseISO(batch.date)
          } else {
            // Format like "15 June 2023"
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

              if (monthMap[month] !== undefined) {
                parsedDate = new Date(Number.parseInt(year), monthMap[month], Number.parseInt(day))
              }
            }
          }
        }

        if (parsedDate && isValid(parsedDate)) {
          const dateKey = format(parsedDate, "yyyy-MM-dd")
          batchMap[dateKey] = batch
          dates.push(parsedDate)
        }
      } catch (error) {
        console.error("Error processing batch:", batch, error)
      }
    })

    setBatchesByDate(batchMap)
    setAvailableDates(dates)
    setTbdBatches(tbdBatchesList)
    setHasTBDBatches(tbdBatchesList.length > 0)

    // If there are available dates, set the current month to the month of the first available date
    if (dates.length > 0) {
      setCurrentMonth(dates[0])
    }

    console.log("Available dates:", dates.length, dates)
    console.log("Batches by date:", Object.keys(batchMap).length, batchMap)
    console.log("TBD batches:", tbdBatchesList.length, tbdBatchesList)
  }, [batches])

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
    if (!date) return false
    const dateKey = format(date, "yyyy-MM-dd")
    return !!batchesByDate[dateKey]
  }

  // Get total available slots for a date
  const getAvailableSlotsForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd")
    const batch = batchesByDate[dateKey]

    if (!batch || !batch.timeSlots) return 0

    return batch.timeSlots.reduce((total, slot) => {
      const availableSlots = Math.max(0, slot.slots - slot.enrolled)
      return total + availableSlots
    }, 0)
  }

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (hasBatches(date)) {
      setSelectedDate(date)
      setSelectedTimeSlot(null)

      // Get the batch for this date
      const dateKey = format(date, "yyyy-MM-dd")
      const batch = batchesByDate[dateKey]
      setSelectedBatch(batch)
      setShowTBDSection(false)
    }
  }

  // Handle TBD batch selection
  const handleTBDBatchSelect = (batch: WorkshopBatch) => {
    setSelectedBatch(batch)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
    setShowTBDSection(true)
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
    if (selectedTimeSlot && selectedBatch && onContinue) {
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
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

          {/* Workshop Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4">
              {workshop.image && !imageError && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={workshop.image || "/placeholder.svg"}
                    alt={workshop.title}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">{workshop.title}</h3>
                {workshop.description && (
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{workshop.description}</p>
                )}
                <div className="mt-2 inline-block bg-[#FFF5F5] p-2 rounded-md">
                  <span className="font-bold text-[#D40F14]">₹{workshop.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* TBD Batches Section */}
          {hasTBDBatches && (
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                <h3 className="font-bold">Upcoming Batches (Dates To Be Determined)</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {batch.timeSlots && batch.timeSlots[0]?.time && batch.timeSlots[0].time !== "TBD" ? (
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 text-[#D40F14] mr-2" />
                        <span className="text-sm">{batch.timeSlots[0].time}</span>
                      </div>
                    ) : (
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 text-[#D40F14] mr-2" />
                        <span className="text-sm">Time to be announced</span>
                      </div>
                    )}
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 text-[#D40F14] mr-2" />
                      <span className="text-sm">
                        {batch.timeSlots && batch.timeSlots[0]?.location
                          ? batch.timeSlots[0].location
                          : "Online Session"}
                      </span>
                    </div>
                    {batch.timeSlots && batch.timeSlots[0] && (
                      <div className="text-sm mt-2">
                        <span className="font-medium text-[#D40F14]">
                          {batch.timeSlots[0].slots - (batch.timeSlots[0].enrolled || 0)}
                        </span>{" "}
                        slots left
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar Section */}
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
                              {batchesByDate[dateKey].timeSlots?.length || 0}{" "}
                              {(batchesByDate[dateKey].timeSlots?.length || 0) === 1 ? "batch" : "batches"} available
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
                {selectedDate && selectedBatch && !showTBDSection ? (
                  <>
                    <div className="flex items-center mb-4">
                      <Calendar className="h-5 w-5 text-[#D40F14] mr-2" />
                      <h3 className="font-bold">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
                    </div>

                    <div className="space-y-3 mb-6">
                      {selectedBatch.timeSlots && selectedBatch.timeSlots.length > 0 ? (
                        selectedBatch.timeSlots.map((timeSlot, index) => {
                          const isFull = timeSlot.slots - timeSlot.enrolled <= 0
                          const isSelected = selectedTimeSlot?.id === timeSlot.id
                          const availableSlots = timeSlot.slots - timeSlot.enrolled

                          return (
                            <div
                              key={timeSlot.id || index}
                              onClick={() => !isFull && handleTimeSlotSelect(timeSlot)}
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

                                {timeSlot.instructor && (
                                  <div className="text-sm text-gray-600">Instructor: {timeSlot.instructor}</div>
                                )}
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center py-8 text-gray-500">No time slots available for this date</div>
                      )}
                    </div>
                  </>
                ) : showTBDSection && selectedBatch ? (
                  <>
                    <div className="flex items-center mb-4">
                      <Calendar className="h-5 w-5 text-amber-500 mr-2" />
                      <h3 className="font-bold">Date To Be Announced</h3>
                    </div>

                    <div className="space-y-3 mb-6">
                      {selectedBatch.timeSlots && selectedBatch.timeSlots.length > 0 ? (
                        selectedBatch.timeSlots.map((timeSlot, index) => {
                          const isFull = timeSlot.slots - timeSlot.enrolled <= 0
                          const isSelected = selectedTimeSlot?.id === timeSlot.id
                          const availableSlots = timeSlot.slots - timeSlot.enrolled

                          return (
                            <div
                              key={timeSlot.id || index}
                              onClick={() => !isFull && handleTimeSlotSelect(timeSlot)}
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
                                  <span className="font-medium">
                                    {timeSlot.time && timeSlot.time !== "TBD" ? timeSlot.time : "Time to be announced"}
                                  </span>
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

                                {timeSlot.instructor && (
                                  <div className="text-sm text-gray-600">Instructor: {timeSlot.instructor}</div>
                                )}
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center py-8 text-gray-500">No time slots available for this batch</div>
                      )}
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
                  <div className="text-center py-8 text-gray-500">
                    {availableDates.length > 0
                      ? "Select a date to view available time slots"
                      : "No scheduled batches available at this time"}
                  </div>
                )}

                {/* Action button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleContinueToBooking}
                    disabled={!selectedTimeSlot}
                    className={`w-full py-3 rounded-md transition-colors ${
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
          )}

          {/* No Batches Message */}
          {availableDates.length === 0 && !hasTBDBatches && (
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <div className="mb-4">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">No Scheduled Batches</h3>
              <p className="text-gray-600 mb-4">
                There are currently no scheduled batches for this workshop. Please check back later or contact us for
                more information.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

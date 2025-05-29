"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"

interface Batch {
  id: string
  date: string
  time: string
  slots: number
  enrolled: number
  location?: string
}

interface EnhancedBatchSelectorProps {
  workshop: any
  onBatchSelected: (batch: Batch) => void
  onContinue: () => void
}

export default function EnhancedBatchSelector({ workshop, onBatchSelected, onContinue }: EnhancedBatchSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
  const [error, setError] = useState("")
  const [availableDates, setAvailableDates] = useState<Date[]>([])

  // Parse batch dates into Date objects for the calendar
  useEffect(() => {
    if (workshop?.batches && Array.isArray(workshop.batches)) {
      const dates = workshop.batches.map((batch) => {
        // Parse date string (assuming format like "15 June 2023")
        const [day, month, year] = batch.date.split(/\s+|,\s*/)
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
        return new Date(Number.parseInt(year), monthMap[month], Number.parseInt(day))
      })
      setAvailableDates(dates)
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
    // Find batches for this date
    if (workshop?.batches && Array.isArray(workshop.batches)) {
      const batchesForDate = workshop.batches.filter((batch) => {
        const [day, month, year] = batch.date.split(/\s+|,\s*/)
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
        const batchDate = new Date(Number.parseInt(year), monthMap[month], Number.parseInt(day))
        return isSameDay(batchDate, date)
      })

      if (batchesForDate.length > 0) {
        // If there's only one batch for this date, select it
        if (batchesForDate.length === 1) {
          setSelectedBatch(batchesForDate[0])
          onBatchSelected(batchesForDate[0])
        }
        // Otherwise, show the batch list for this date
        // (This would be handled by the UI showing the batch list below)
      }
    }
  }

  const handleBatchSelect = (batch: Batch) => {
    setSelectedBatch(batch)
    onBatchSelected(batch)
    setError("")
  }

  const handleContinue = () => {
    if (!selectedBatch) {
      setError("Please select a batch to continue")
      return
    }

    if (selectedBatch.enrolled >= selectedBatch.slots) {
      setError("This batch is full. Please select another batch.")
      return
    }

    setError("")
    onContinue()
  }

  // Find batches for the selected date
  const selectedDateBatches = selectedBatch
    ? workshop?.batches?.filter((batch) => batch.date === selectedBatch.date) || []
    : []

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Select a Batch</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="font-bold">{format(currentMonth, "MMMM yyyy")}</h3>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}

          {/* Empty cells for days before the start of the month */}
          {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, index) => (
            <div key={`empty-start-${index}`} className="h-10 rounded-md"></div>
          ))}

          {/* Days of the month */}
          {daysInMonth.map((day) => {
            const hasAvailableBatch = availableDates.some((date) => isSameDay(date, day))
            const isSelected =
              selectedBatch &&
              isSameDay(
                new Date(
                  selectedBatch.date.split(/\s+|,\s*/)[2],
                  [
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
                  ].indexOf(selectedBatch.date.split(/\s+|,\s*/)[1]),
                  selectedBatch.date.split(/\s+|,\s*/)[0],
                ),
                day,
              )

            return (
              <button
                key={day.toString()}
                onClick={() => hasAvailableBatch && handleDateClick(day)}
                className={`h-10 rounded-md flex items-center justify-center text-sm ${
                  hasAvailableBatch
                    ? isSelected
                      ? "bg-[#D40F14] text-white font-bold"
                      : "bg-[#FFF5F5] text-[#D40F14] hover:bg-[#FFECEC] cursor-pointer"
                    : "text-gray-400 cursor-default"
                }`}
                disabled={!hasAvailableBatch}
              >
                {format(day, "d")}
              </button>
            )
          })}
        </div>

        {/* Batch List for Selected Date */}
        {selectedDateBatches.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-4">Available Batches for {selectedBatch?.date}:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDateBatches.map((batch, index) => {
                const isFull = batch.slots - batch.enrolled <= 0
                const isSelected = selectedBatch?.id === batch.id

                return (
                  <div
                    key={batch.id || index}
                    className={`p-4 rounded-lg border transition-all ${
                      isFull
                        ? "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
                        : isSelected
                          ? "border-[#D40F14] bg-[#FFF5F5] shadow-md cursor-pointer"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300 cursor-pointer"
                    }`}
                    onClick={() => !isFull && handleBatchSelect(batch)}
                  >
                    <div className="font-bold mb-2">Batch {index + 1}</div>
                    <div className="flex items-center mb-2">
                      <CalendarIcon className="h-4 w-4 text-[#D40F14] mr-2" />
                      <span className="text-sm">{batch.date}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 text-[#D40F14] mr-2" />
                      <span className="text-sm">{batch.time}</span>
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
                            <span className="font-medium text-[#D40F14]">{batch.slots - batch.enrolled}</span> slots
                            left
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          className="px-6 py-2 bg-[#D40F14] text-white rounded-lg hover:bg-[#B00D11] transition-colors"
          disabled={!selectedBatch}
        >
          Continue to Booking
        </button>
      </div>
    </div>
  )
}

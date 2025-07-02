"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ App Router
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  X,
  Calendar,
  Info,
} from "lucide-react";
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
} from "date-fns";
import { toast } from "sonner";
import PaymentDetails from "../booking/landing/payment-details";
import PaymentPopupSuccessStyle from "../booking/payment/payment-popup-success-style";
import { parseFlexibleDate } from "@/lib/date-utils";
// import router from "next/router";

interface Batch {
  id: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  date?: string;
  time?: string;
  location?: string;
  slots?: number;
  enrolled?: number;
  instructor?: string;
  schedule?: string;
  status?: string;
}

interface Workshop {
  id: string;
  title: string;
  description?: string;
  price: number;
  batches: Batch[];
}

interface CalendarBatchSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  workshop: Workshop;
  onBatchSelected: (batch: Batch) => void;
  onContinue: (batch: Batch) => void;
  student_id?: string;
  studentEmail?: string;
}

export default function CalendarBatchSelector({
  isOpen,
  onClose,
  workshop,
  onBatchSelected,
  onContinue,
  student_id,
  studentEmail,
}: CalendarBatchSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [batchesByDate, setBatchesByDate] = useState<Record<string, Batch[]>>(
    {}
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const router = useRouter();
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showFreePopup, setShowFreePopup] = useState(false);

  useEffect(() => {
    if (workshop?.batches && Array.isArray(workshop.batches)) {
      const dates: Date[] = [];
      const batchMap: Record<string, Batch[]> = {};
      let startDate: Date | null = null;
      let endDate: Date | null = null;

      workshop.batches.forEach((batch) => {
        try {
          let batchStartDate: Date | null = null;
          let batchEndDate: Date | null = null;

          if (batch.start_date) {
            batchStartDate = parseISO(batch.start_date);
            if (!startDate || isBefore(batchStartDate, startDate))
              startDate = batchStartDate;
          }
          if (batch.end_date) {
            batchEndDate = parseISO(batch.end_date);
            if (!endDate || isAfter(batchEndDate, endDate))
              endDate = batchEndDate;
          }
          if (batch.date && !batch.start_date && !batch.end_date) {
            const parts = batch.date.split(/\s+|,\s*/);
            if (parts.length >= 3) {
              const [day, month, year] = parts;
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
              };
              const singleDate = new Date(
                Number(year),
                monthMap[month],
                Number(day)
              );
              batchStartDate = singleDate;
              batchEndDate = singleDate;
            }
          }
          if (batchStartDate && batchEndDate) {
            const range = eachDayOfInterval({
              start: batchStartDate,
              end: batchEndDate,
            });
            range.forEach((date) => {
              const dateKey = format(date, "yyyy-MM-dd");
              if (!batchMap[dateKey]) batchMap[dateKey] = [];
              batchMap[dateKey].push(batch);
              if (!dates.some((d) => isSameDay(d, date))) dates.push(date);
            });
          }
        } catch (err) {
          console.error("Failed to parse batch:", err);
        }
      });

      setAvailableDates(dates);
      setBatchesByDate(batchMap);
      setDateRange({ start: startDate, end: endDate });
      if (dates.length > 0) setCurrentMonth(dates[0]);
    }
  }, [workshop]);

  const handleContinue = () => {
    if (!selectedBatch) return;
    if (workshop.price === 0) {
      setShowFreePopup(true);
    } else {
      setShowPaymentDetails(true);
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const isDateInRange = (date: Date) => {
    return dateRange.start && dateRange.end
      ? isWithinInterval(date, { start: dateRange.start, end: dateRange.end })
      : false;
  };

  const hasAvailableBatches = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    return Boolean(batchesByDate[key]?.length);
  };

  const handleDateClick = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    const batches = batchesByDate[key] || [];
    setSelectedDate(date);
    if (batches.length === 1) {
      setSelectedBatch(batches[0]);
      onBatchSelected(batches[0]);
    } else {
      setSelectedBatch(null);
    }
  };

  const handleBatchSelect = (batch: Batch) => {
    setSelectedBatch(batch);
    onBatchSelected(batch);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Select a Batch</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <h3 className="text-lg font-semibold mb-4">{workshop.title}</h3>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h4 className="text-xl font-bold">
              {format(currentMonth, "MMMM yyyy")}
            </h4>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map(
              (_, idx) => (
                <div key={idx}></div>
              )
            )}

            {eachDayOfInterval({
              start: startOfMonth(currentMonth),
              end: endOfMonth(currentMonth),
            }).map((date) => {
              const dateKey = format(date, "yyyy-MM-dd");
              const isSelectable =
                isDateInRange(date) && hasAvailableBatches(date);
              const isSelected = selectedDate && isSameDay(date, selectedDate);

              return (
                <button
                  key={date.toString()}
                  onClick={() => isSelectable && handleDateClick(date)}
                  className={`h-12 rounded-md text-sm flex items-center justify-center transition-colors
                    ${
                      isSelectable
                        ? isSelected
                          ? "bg-[#D40F14] text-white font-bold"
                          : "bg-[#FFF5F5] text-[#D40F14] hover:bg-[#FFECEC]"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {format(date, "d")}
                </button>
              );
            })}
          </div>

          {/* Batches */}
          {selectedDate && (
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-2">
                Batches for {format(selectedDate, "MMM d, yyyy")}:
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {batchesByDate[format(selectedDate, "yyyy-MM-dd")]?.map(
                  (batch) => {
                    const isSelected = selectedBatch?.id === batch.id;
                    const start = batch.start_date ? parseFlexibleDate(batch.start_date) : null;
                    const end = batch.end_date ? parseFlexibleDate(batch.end_date) : null;
                    const single = batch.date ? parseFlexibleDate(batch.date) : null;
                    return (
                      <div
                        key={batch.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all
                        ${
                          isSelected
                            ? "border-[#D40F14] bg-[#FFF5F5]"
                            : "hover:border-gray-300"
                        }`}
                        onClick={() => handleBatchSelect(batch)}
                      >
                        <p className="font-medium">
                          Date: {start && end
                            ? `${start.toLocaleDateString('en-GB')} - ${end.toLocaleDateString('en-GB')}`
                            : single
                              ? single.toLocaleDateString('en-GB')
                              : 'Date TBD'}
                        </p>
                        <p className="font-medium">
                          Time: {batch.time || `${batch.start_time} - ${batch.end_time}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          Location: {batch.location || "Online"}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
                : workshop.price === 0
                ? "Confirm"
                : "Continue to Payment"}
            </button>
          </div>
        </div>
      </div>
      {showFreePopup && selectedBatch && (
        <PaymentPopupSuccessStyle
          orderId={`ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`}
          amount={0}
          batch={{
            date: selectedBatch.date,
            time: selectedBatch.time,
            location: selectedBatch.location,
            start_date: selectedBatch.start_date,
            end_date: selectedBatch.end_date,
            start_time: selectedBatch.start_time,
            end_time: selectedBatch.end_time,
          }}
          studentId={student_id || ""}
          workshopId={workshop.id}
          batchId={selectedBatch.id}
          onClose={async () => {
            // Send workshop confirmation email for free enrollment via API route
            try {
              await fetch("/api/send-free-workshop-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  to: studentEmail || student_id, // Use actual email field if available
                  batch: selectedBatch,
                }),
              });
            } catch (err) {
              console.error("❌ Free workshop email failed:", err);
            }
            setShowFreePopup(false);
            onClose();
            router.push("/booking/success");
          }}
        />
      )}
      {showPaymentDetails && (
        (() => {
          if (!student_id || !selectedBatch || !selectedBatch.id) {
            alert("Missing student or batch information. Please try again.");
            console.error("Missing student_id or selectedBatch.id", { student_id, selectedBatch });
            return null;
          }
          console.log("Rendering PaymentDetails with:", { student_id, batchId: selectedBatch.id });
          return (
            <PaymentDetails
              studentData={{ id: student_id }}
              workshopData={workshop}
              selectedBatch={selectedBatch}
              onCancel={() => setShowPaymentDetails(false)}
              onProceed={() => {
                setShowPaymentDetails(false);
                onClose();
              }}
            />
          );
        })()
      )}
    </>
  );
}

"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
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

export default function MonthlyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of the month and number of days in month
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Get days from previous month to fill the grid
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const prevMonthDays = Array.from({ length: firstDayWeekday }, (_, i) => daysInPrevMonth - firstDayWeekday + i + 1)

  // Get days for current month
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Get days from next month to fill remaining grid cells
  const totalCells = 42 // 6 rows × 7 days
  const remainingCells = totalCells - prevMonthDays.length - currentMonthDays.length
  const nextMonthDays = Array.from({ length: remainingCells }, (_, i) => i + 1)

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false
    const today = new Date()
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold">
          {MONTHS[month]} {year}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-0 border border-border">
          {/* Days of week header */}
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="p-4 text-center text-sm font-semibold text-muted-foreground bg-muted/30 border-r border-b border-border last:border-r-0"
            >
              {day}
            </div>
          ))}

          {/* Previous month days */}
          {prevMonthDays.map((day) => (
            <div
              key={`prev-${day}`}
              className="h-32 p-2 text-muted-foreground/50 hover:bg-muted/30 cursor-pointer border-r border-b border-border last:border-r-0 flex flex-col"
            >
              <div className="text-sm mb-1">{day}</div>
              <div className="flex-1 space-y-1">{/* Space for events */}</div>
            </div>
          ))}

          {/* Current month days */}
          {currentMonthDays.map((day) => (
            <div
              key={`current-${day}`}
              className={`h-32 p-2 hover:bg-muted/30 cursor-pointer border-r border-b border-border last:border-r-0 flex flex-col transition-colors ${
                isToday(day, true) ? "bg-primary/10" : "bg-background"
              }`}
            >
              <div
                className={`text-sm mb-1 ${isToday(day, true) ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center font-semibold" : "text-foreground"}`}
              >
                {day}
              </div>
              <div className="flex-1 space-y-1">
                {/* Space for events - you can add event components here */}
                {day === 15 && (
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate">Sample Event</div>
                )}
                {day === 22 && (
                  <>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded truncate">Meeting</div>
                    <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded truncate">Workshop</div>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Next month days */}
          {nextMonthDays.map((day) => (
            <div
              key={`next-${day}`}
              className="h-32 p-2 text-muted-foreground/50 hover:bg-muted/30 cursor-pointer border-r border-b border-border last:border-r-0 flex flex-col"
            >
              <div className="text-sm mb-1">{day}</div>
              <div className="flex-1 space-y-1">{/* Space for events */}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

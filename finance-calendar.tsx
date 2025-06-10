"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

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

// Sample spending data - in a real app, this would come from your backend
const SAMPLE_SPENDING_DATA: Record<
  string,
  {
    total: number
    transactions: Array<{ category: string; amount: number; description: string }>
    budget: number
  }
> = {
  "2024-12-1": {
    total: 45.67,
    budget: 50,
    transactions: [
      { category: "Food", amount: 12.5, description: "Coffee & Pastry" },
      { category: "Transport", amount: 15.0, description: "Uber ride" },
      { category: "Shopping", amount: 18.17, description: "Groceries" },
    ],
  },
  "2024-12-3": {
    total: 127.89,
    budget: 50,
    transactions: [
      { category: "Food", amount: 67.89, description: "Dinner at restaurant" },
      { category: "Entertainment", amount: 25.0, description: "Movie tickets" },
      { category: "Shopping", amount: 35.0, description: "Clothing" },
    ],
  },
  "2024-12-5": {
    total: 23.45,
    budget: 50,
    transactions: [
      { category: "Food", amount: 8.45, description: "Lunch" },
      { category: "Transport", amount: 15.0, description: "Bus pass" },
    ],
  },
  "2024-12-8": {
    total: 89.32,
    budget: 50,
    transactions: [
      { category: "Shopping", amount: 45.32, description: "Household items" },
      { category: "Food", amount: 24.0, description: "Groceries" },
      { category: "Health", amount: 20.0, description: "Pharmacy" },
    ],
  },
  "2024-12-12": {
    total: 156.78,
    budget: 50,
    transactions: [
      { category: "Shopping", amount: 89.99, description: "Electronics" },
      { category: "Food", amount: 34.5, description: "Restaurant" },
      { category: "Transport", amount: 32.29, description: "Gas" },
    ],
  },
  "2024-12-15": {
    total: 34.21,
    budget: 50,
    transactions: [
      { category: "Food", amount: 19.21, description: "Breakfast" },
      { category: "Entertainment", amount: 15.0, description: "Streaming service" },
    ],
  },
}

export default function FinanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const getSpendingData = (day: number) => {
    const dateKey = `${year}-${month + 1}-${day}`
    return SAMPLE_SPENDING_DATA[dateKey]
  }

  const getSpendingColor = (spending: number, budget: number) => {
    const percentage = (spending / budget) * 100
    if (percentage <= 50) return "text-green-600 bg-green-50"
    if (percentage <= 80) return "text-yellow-600 bg-yellow-50"
    if (percentage <= 100) return "text-orange-600 bg-orange-50"
    return "text-red-600 bg-red-50"
  }

  const handleDayClick = (day: number, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      setSelectedDay(day)
      setIsModalOpen(true)
    }
  }

  const selectedDayData = selectedDay ? getSpendingData(selectedDay) : null

  // Calculate monthly totals
  const monthlyTotal = Object.values(SAMPLE_SPENDING_DATA).reduce((sum, data) => sum + data.total, 0)
  const monthlyBudget = Object.values(SAMPLE_SPENDING_DATA).reduce((sum, data) => sum + data.budget, 0)

  return (
    <>
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              {MONTHS[month]} {year}
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Monthly Total:</span>
                <span className="font-semibold text-lg">${monthlyTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Budget:</span>
                <span className="font-semibold">${monthlyBudget.toFixed(2)}</span>
              </div>
            </div>
          </div>
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
          <div className="grid grid-cols-7 gap-0 border border-border rounded-lg overflow-hidden">
            {/* Days of week header */}
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="p-4 text-center text-sm font-semibold text-muted-foreground bg-slate-50 border-r border-b border-border last:border-r-0"
              >
                {day}
              </div>
            ))}

            {/* Previous month days */}
            {prevMonthDays.map((day) => (
              <div
                key={`prev-${day}`}
                className="h-28 p-3 text-muted-foreground/40 border-r border-b border-border last:border-r-0 flex flex-col bg-slate-50/50"
              >
                <div className="text-sm mb-1">{day}</div>
              </div>
            ))}

            {/* Current month days */}
            {currentMonthDays.map((day) => {
              const spendingData = getSpendingData(day)
              const hasSpending = !!spendingData

              return (
                <div
                  key={`current-${day}`}
                  onClick={() => handleDayClick(day, true)}
                  className={`h-28 p-3 hover:bg-slate-50 cursor-pointer border-r border-b border-border last:border-r-0 flex flex-col transition-all duration-200 ${
                    isToday(day, true) ? "bg-blue-50 ring-2 ring-blue-200" : "bg-background"
                  } ${hasSpending ? "hover:shadow-md" : ""}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`text-sm font-medium ${
                        isToday(day, true)
                          ? "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          : "text-foreground"
                      }`}
                    >
                      {day}
                    </div>
                    {hasSpending && <DollarSign className="h-3 w-3 text-green-600" />}
                  </div>

                  {hasSpending && (
                    <div className="flex-1 flex flex-col justify-center">
                      <div
                        className={`text-xs px-2 py-1 rounded-md text-center font-medium ${getSpendingColor(spendingData.total, spendingData.budget)}`}
                      >
                        ${spendingData.total.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground text-center mt-1">
                        {spendingData.transactions.length} transaction
                        {spendingData.transactions.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Next month days */}
            {nextMonthDays.map((day) => (
              <div
                key={`next-${day}`}
                className="h-28 p-3 text-muted-foreground/40 border-r border-b border-border last:border-r-0 flex flex-col bg-slate-50/50"
              >
                <div className="text-sm mb-1">{day}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spending Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              {MONTHS[month]} {selectedDay}, {year}
            </DialogTitle>
          </DialogHeader>

          {selectedDayData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spending</p>
                  <p className="text-2xl font-bold">${selectedDayData.total.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Daily Budget</p>
                  <p className="text-lg font-semibold">${selectedDayData.budget.toFixed(2)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {selectedDayData.total > selectedDayData.budget ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-600">Over budget</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600">Under budget</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Transactions</h4>
                <div className="space-y-2">
                  {selectedDayData.transactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {transaction.category}
                        </Badge>
                      </div>
                      <p className="font-semibold">${transaction.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No spending recorded for this day</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

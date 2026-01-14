"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTodos } from "@/hooks/use-todos"

export default function CalendarContent({ user }: { user: any }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week">("month")
  const { todos, isLoading } = useTodos()

  if (isLoading) return <div className="flex items-center justify-center h-full">Loading...</div>

  const statusColors: { [key: string]: string } = {
    draft: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800", 
    completed: "bg-green-100 text-green-800",
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getTasksForDate = (dateStr: string) => {
    return todos.filter((todo: any) => {
      if (!todo.dueAt) return false
      const todoDate = new Date(todo.dueAt).toISOString().split("T")[0]
      return todoDate === dateStr
    })
  }

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="bg-gray-50 min-h-24 p-2 rounded-lg"></div>)
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayTasks = getTasksForDate(dateStr)
      const isToday =
        new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

      days.push(
        <div
          key={day}
          className={`min-h-24 p-2 rounded-lg border ${
            isToday ? "border-primary bg-primary/5" : "border-gray-200 bg-white"
          } hover:shadow-sm transition`}
        >
          <p className={`font-semibold text-sm mb-1 ${isToday ? "text-primary" : ""}`}>{day}</p>
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {dayTasks.map((task: any) => (
              <div
                key={task.id}
                className={`text-xs p-1 rounded truncate cursor-pointer ${
                  statusColors[task.state] || "bg-gray-100"
                }`}
                title={task.name}
              >
                {task.name}
              </div>
            ))}
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">
          {currentDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setMonth(newDate.getMonth() - 1)
              setCurrentDate(newDate)
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setMonth(newDate.getMonth() + 1)
              setCurrentDate(newDate)
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{renderMonthView()}</div>
      </div>
    </div>
  )
}
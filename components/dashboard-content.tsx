"use client"

import { useTodos } from "@/lib/queries/tasks"
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardContent({ user }: { user: any }) {
  const { data: todos = [], isLoading } = useTodos()

  // Calculate stats from todos
  const taskStats = {
    draft: 0,
    in_progress: 0,
    completed: 0,
  }

  todos?.forEach((todo: any) => {
    if (todo.state === "draft") taskStats.draft++
    else if (todo.state === "in_progress") taskStats.in_progress++
    else if (todo.state === "completed") taskStats.completed++
  })

  const chartData = [
    { name: "Draft", value: taskStats.draft, fill: "#f5deb3" },
    { name: "In Progress", value: taskStats.in_progress, fill: "#b8e0d2" },
    { name: "Completed", value: taskStats.completed, fill: "#a8d5ba" },
  ]

  const total = Object.values(taskStats).reduce((a, b) => a + b, 0)

  if (isLoading) {
    return (
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="text-gray-400">Loading tasks...</div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-8 overflow-auto">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Progress Pie Chart */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center h-80">
            {total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">No tasks yet</div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Task Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Draft</span>
              <span className="text-2xl font-bold">{taskStats.draft}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">In Progress</span>
              <span className="text-2xl font-bold">{taskStats.in_progress}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="text-2xl font-bold">{taskStats.completed}</span>
            </div>
            <div className="pt-4 border-t flex items-center justify-between font-semibold">
              <span>Total</span>
              <span className="text-2xl">{total}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

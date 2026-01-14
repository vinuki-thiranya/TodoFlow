"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTodos } from "@/hooks/use-todos"
import { useLists } from "@/hooks/use-lists"
import { useTags } from "@/hooks/use-tags"
import TaskDetailPanel from "@/components/task-detail-panel"

export default function TodayContent({ user }: { user: any }) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const { todos, isLoading, createTodo, updateTodo } = useTodos()
  const { lists } = useLists(user?.id)
  const { tags } = useTags(user?.id)

  // Filter todos for today
  const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time
  const todayTodos = todos.filter((todo: any) => {
    if (!todo.dueAt) return false
    const todoDate = new Date(todo.dueAt).toLocaleDateString('en-CA')
    return todoDate === today
  })

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim() || !lists[0]) return

    try {
      await createTodo({
        name: newTaskTitle,
        listId: lists[0].id,
        description: "",
        dueAt: new Date().toISOString(),
      })
      setNewTaskTitle("")
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-full">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto flex gap-8">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold font-heading">Today</h1>
          <span className="text-2xl text-muted-foreground">{todayTodos.length}</span>
        </div>

        <div className="max-w-2xl">
          {/* Add New Task */}
          <div className="flex gap-2 mb-6">
            <Input
              type="text"
              placeholder="Add a task for today..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateTask()}
              className="flex-1 shadow-sm border-2 border-gray-200 focus:border-primary focus:shadow-sm transition-all"
            />
            <Button onClick={handleCreateTask} className="px-4 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {todayTodos.map((todo: any) => (
              <Card 
                key={todo.id} 
                className="hover:shadow-sm transition-shadow cursor-pointer group border-2 border-gray-100"
                onClick={() => setSelectedTask(todo)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={todo.state === "completed"}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation()
                        updateTodo({
                          id: todo.id,
                          state: todo.state === "completed" ? "draft" : "completed",
                        })
                      }}
                      className="w-4 h-4 cursor-pointer accent-primary"
                    />
                    <span className={todo.state === "completed" ? "line-through text-muted-foreground" : "font-medium"}>
                      {todo.name}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            ))}
            
            {todayTodos.length === 0 && (
              <div className="text-center py-12 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-muted-foreground font-medium">No tasks scheduled for today</p>
                <p className="text-sm text-muted-foreground mt-1">Add a task above to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          tags={tags}
          user={user}
          onUpdate={async (updates) => {
            await updateTodo({ id: selectedTask.id, ...updates })
            setSelectedTask({ ...selectedTask, ...updates })
          }}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  )
}
"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import TaskDetailPanel from "@/components/task-detail-panel"
import { useTodos } from "@/hooks/use-todos"
import { useLists } from "@/hooks/use-lists"
import { useTags } from "@/hooks/use-tags"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function TasksContentInner({ user }: { user: any }) {
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const searchParams = useSearchParams()
  const listId = searchParams.get("list")

  const { todos, isLoading, createTodo, updateTodo } = useTodos()
  const { lists } = useLists(user?.id)
  const { tags } = useTags(user?.id)

  // Filter todos by list if specified
  const filteredTodos = listId 
    ? todos.filter((todo: any) => todo.listId === listId)
    : todos

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim() || !listId || !lists[0]) return

    try {
      await createTodo(
        {
        name: newTaskTitle,
        listId: listId,
        description: "",
      }
    )
      setNewTaskTitle("")
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-full">Loading...</div>

  const currentList = lists.find((l: any) => l.id === listId)

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">{currentList?.title || "All Tasks"}</h1>
          <span className="text-2xl text-muted-foreground">{filteredTodos.length}</span>
        </div>

        <div className="max-w-2xl">
          {listId && (
            <div className="flex gap-2 mb-6">
              <Input
                type="text"
                placeholder="Add New Task"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateTask()}
                className="flex-1 shadow-sm border-2 border-gray-200 focus:border-primary focus:shadow-sm transition-all"
              />
              <Button onClick={handleCreateTask}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {filteredTodos.map((todo: any) => (
              <Card
                key={todo.id}
                className="cursor-pointer hover:shadow-sm transition"
                onClick={() => setSelectedTask(todo)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={todo.state === "completed"}
                      onChange={(e) => {
                        e.stopPropagation()
                        updateTodo({
                          id: todo.id,
                          state: todo.state === "completed" ? "draft" : "completed",
                        })
                      }}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className={todo.state === "completed" ? "line-through text-muted-foreground" : ""}>
                        {todo.name}
                      </p>
                      {todo.dueAt && (
                        <p className="text-xs text-muted-foreground">
                          📅 {new Date(todo.dueAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </CardContent>
              </Card>
            )
        )
            }
            
            {filteredTodos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {listId ? "No tasks in this list" : "No tasks found"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          tags={tags}
          onUpdate={async (updates) => {
            try {
              await updateTodo({ id: selectedTask.id, ...updates })
              setSelectedTask({ ...selectedTask, ...updates })
            } catch (error) {
              console.error("Failed to update task:", error)
            }
          }}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  )
}

export default function TasksContent({ user }: { user: any }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
      <TasksContentInner user={user} />
    </Suspense>
  )
}
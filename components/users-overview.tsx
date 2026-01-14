"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useUsers } from "@/hooks/use-users"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { User, Mail, Calendar, CheckCircle, Clock, FileText, Trash2 } from "lucide-react"

export default function UsersOverview({ currentUser }: { currentUser: any }) {
  const { data: users, isLoading, error } = useUsers()
  const queryClient = useQueryClient()

  const deleteTodoMutation = useMutation({
    mutationFn: async (todoId: string) => {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete todo')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (error: Error) => {
      console.error('Error deleting todo:', error)
      alert(error.message)
    }
  })

  const handleDeleteTodo = (todoId: string, todoName: string) => {
    if (window.confirm(`Are you sure you want to delete "${todoName}"?`)) {
      deleteTodoMutation.mutate(todoId)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400">Loading users...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Failed to load users</div>
        </CardContent>
      </Card>
    )
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800"
      case "manager": return "bg-blue-100 text-blue-800"
      default: return "bg-green-100 text-green-800"
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case "completed": return "text-green-600"
      case "in_progress": return "text-blue-600"
      case "draft": return "text-gray-600"
      default: return "text-gray-600"
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case "completed": return <CheckCircle className="w-3 h-3" />
      case "in_progress": return <Clock className="w-3 h-3" />
      case "draft": return <FileText className="w-3 h-3" />
      default: return <FileText className="w-3 h-3" />
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          All Users & Their Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {users?.map((user: any) => (
            <div key={user.id} className="border rounded-lg p-4">
              {/* User Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name || "Unnamed User"}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getRoleColor(user.userRole)}>
                    {user.userRole}
                  </Badge>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Task Stats */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xl font-bold">{user.taskStats.total}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-xl font-bold text-green-600">{user.taskStats.completed}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-xl font-bold text-blue-600">{user.taskStats.in_progress}</div>
                  <div className="text-xs text-gray-600">In Progress</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="text-xl font-bold text-yellow-600">{user.taskStats.draft}</div>
                  <div className="text-xs text-gray-600">Draft</div>
                </div>
              </div>

              {/* Recent Tasks */}
              {user.tasks.length > 0 ? (
                <div>
                  <h4 className="font-medium mb-2 text-sm text-gray-700">Recent Tasks</h4>
                  <div className="space-y-2">
                    {user.tasks.map((task: any) => (
                      <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <div className="flex items-center gap-2">
                          <div className={getStateColor(task.state)}>
                            {getStateIcon(task.state)}
                          </div>
                          <span className="font-medium">{task.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {task.dueAt && (
                              <span>Due: {new Date(task.dueAt).toLocaleDateString()}</span>
                            )}
                            <span>Created: {new Date(task.createdOn).toLocaleDateString()}</span>
                          </div>
                          {currentUser?.userRole === 'admin' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTodo(task.id, task.name)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              disabled={deleteTodoMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  No tasks yet
                </div>
              )}
            </div>
          ))}
          
          {users?.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No users found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
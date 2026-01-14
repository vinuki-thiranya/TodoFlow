"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Trash2 } from "lucide-react"
import { useTodos } from "@/hooks/use-todos"

interface TaskDetailPanelProps {
  task: any
  tags: any[]
  user: any
  onUpdate: (updates: any) => void
  onClose: () => void
}

export default function TaskDetailPanel({ task, tags, user, onUpdate, onClose }: TaskDetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(task.name)
  const [editedDescription, setEditedDescription] = useState(task.description || "")
  const [editedDueAt, setEditedDueAt] = useState(task.dueAt ? new Date(task.dueAt).toISOString().split('T')[0] : "")
  const [editedState, setEditedState] = useState(task.state)
  const { deleteTodo } = useTodos()

  // Sync state when task prop changes
  useEffect(() => {
    setEditedName(task.name)
    setEditedDescription(task.description || "")
    setEditedDueAt(task.dueAt ? new Date(task.dueAt).toISOString().split('T')[0] : "")
    setEditedState(task.state)
  }, [task])

  const handleSave = async () => {
    if (editedName.trim()) {
      const updates = {
        name: editedName,
        description: editedDescription || null,
        dueAt: editedDueAt ? new Date(editedDueAt).toISOString() : null,
        state: editedState,
      }
      await onUpdate(updates)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditedName(task.name)
    setEditedDescription(task.description || "")
    setEditedDueAt(task.dueAt ? new Date(task.dueAt).toISOString().split('T')[0] : "")
    setEditedState(task.state)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTodo(task.id)
      onClose()
    }
  }

  // RBAC Permission Logic (ABAC)
  const canDelete = user?.userRole === 'admin' || (user?.userRole === 'user' && task.state === 'draft' && task.ownerId === user?.id)
  const canUpdate = user?.userRole === 'user' && task.ownerId === user?.id

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white shadow-xl border-l overflow-y-auto z-50">
      <div className="bg-primary text-primary-foreground p-6 sticky top-0 flex justify-between items-center">
        <h2 className="text-xl font-bold">Task Details</h2>
        <div className="flex items-center gap-2">
          {canDelete && (
            <button 
              onClick={handleDelete}
              className="p-1 hover:bg-red-500 rounded transition-colors text-white"
              title="Delete task"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button onClick={onClose} className="p-1 hover:bg-primary/80 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <Label className="text-sm text-muted-foreground">Title</Label>
          {isEditing ? (
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Task title"
              className="mt-2 shadow-sm border-2 border-gray-200 focus:border-primary focus:shadow-sm transition-all"
            />
          ) : (
            <h3 className="text-xl font-bold mt-2">{task.name}</h3>
          )}
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Description</Label>
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Add description..."
              className="w-full mt-2 p-2 border-2 border-gray-200 focus:border-primary rounded text-sm min-h-[80px] resize-none shadow-sm focus:shadow-sm transition-all"
            />
          ) : (
            <p className="text-sm mt-2">{task.description || "No description"}</p>
          )}
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Due date</Label>
          {isEditing ? (
            <Input 
              type="date" 
              value={editedDueAt} 
              onChange={(e) => setEditedDueAt(e.target.value)} 
              className="mt-2 shadow-sm border-2 border-gray-200 focus:border-primary focus:shadow-sm transition-all"
            />
          ) : (
            <p className="text-sm mt-2">
              {task.dueAt ? new Date(task.dueAt).toLocaleDateString() : "No due date"}
            </p>
          )}
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Status</Label>
          {isEditing ? (
            <select
              value={editedState}
              onChange={(e) => setEditedState(e.target.value)}
              className="w-full mt-2 p-2 border-2 border-gray-200 focus:border-primary rounded text-sm shadow-sm focus:shadow-sm transition-all"
            >
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          ) : (
            <p className="text-sm mt-2 capitalize">{task.state?.replace('_', ' ')}</p>
          )}
        </div>

        {/* Show task owner for managers and admins */}
        {(user?.userRole === 'manager' || user?.userRole === 'admin') && task.owner && (
          <div>
            <Label className="text-sm text-muted-foreground">Created by</Label>
            <p className="text-sm mt-2 font-medium">{task.owner.name || task.owner.email}</p>
          </div>
        )}

        {canUpdate && (
          <div className="flex gap-2 pt-4">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex-1">
                  Save changes
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="w-full">
                Edit Task
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
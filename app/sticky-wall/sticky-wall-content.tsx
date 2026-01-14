"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNotes } from "@/hooks/use-notes"

interface Note {
  id: string
  title: string
  content: string
  themeColor: string
}

export default function StickyWallContent({ user }: { user: any }) {
  const { notes, isLoading, createNote, deleteNote } = useNotes()
  const [showNewNote, setShowNewNote] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteColor, setNewNoteColor] = useState("#FEF08A")

  const colors = [
    { value: "#FEF08A", name: "Yellow" },
    { value: "#A7F3D0", name: "Teal" },
    { value: "#FCD34D", name: "Amber" },
    { value: "#FBCFE8", name: "Pink" },
  ]

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) return

    await createNote({
      title: newNoteTitle,
      content: newNoteContent,
      themeColor: newNoteColor,
    })

    setNewNoteTitle("")
    setNewNoteContent("")
    setNewNoteColor("#FEF08A")
    setShowNewNote(false)
  }

  if (isLoading) return <div className="flex items-center justify-center h-full">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Sticky Wall</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notes.map((note: Note) => (
          <div
            key={note.id}
            className="p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition min-h-48 relative group"
            style={{ backgroundColor: note.themeColor }}
          >
            <button
              onClick={() => deleteNote(note.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 hover:bg-black/5 rounded"
            >
              <X className="w-4 h-4 text-gray-600 hover:text-red-600" />
            </button>
            <h3 className="font-bold text-base mb-2 pr-6">{note.title}</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
          </div>
        ))}

        {/* Add New Note Card */}
        {showNewNote ? (
          <div className="p-4 rounded-lg shadow-md bg-white border-2 border-dashed border-gray-300 min-h-48 flex flex-col">
            <Input
              type="text"
              placeholder="Note title..."
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="mb-2 text-sm font-bold border-none focus-visible:ring-0 p-0"
              autoFocus
            />
            <textarea
              placeholder="Note content..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="flex-1 text-sm resize-none p-0 border-none outline-none mb-2 min-h-[80px]"
            />
            <div className="flex gap-2 mb-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  className={`w-6 h-6 rounded-full cursor-pointer border-2 transition ${
                    newNoteColor === color.value ? "border-gray-800 scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setNewNoteColor(color.value)}
                  title={color.name}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateNote} size="sm" className="flex-1">
                Add Note
              </Button>
              <Button onClick={() => setShowNewNote(false)} size="sm" variant="ghost" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNewNote(true)}
            className="p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition min-h-48 flex items-center justify-center cursor-pointer"
          >
            <Plus className="w-8 h-8 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  )
}
